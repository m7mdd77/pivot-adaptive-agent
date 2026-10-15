import {randomUUID} from 'node:crypto';
import {hash,PivotError,validateCandidatePlan} from '../src/contracts.js';
import {trace,saveRevision} from '../src/runner.js';
import {planningContext} from '../src/planner-contract.js';

export function gatewayConfig(env){
 try{const url=new URL(env.PIVOT_AI_GATEWAY_URL);if(url.protocol!=='https:'||!url.hostname.endsWith('.trycloudflare.com')||url.username||url.password||url.search||url.hash||! /^[a-f0-9]{64}$/.test(env.PIVOT_AI_GATEWAY_TOKEN??''))return null;return{url:url.origin,token:env.PIVOT_AI_GATEWAY_TOKEN};}catch{return null;}
}
export function startInference(state){
 const now=Date.now();
 if(state.pendingPlanner){const old=state.inference.find(a=>a.id===state.pendingPlanner);if(!old||now-old.createdAt<90000)throw new PivotError('AI is already planning.',409);Object.assign(old,{status:'failed',error:'AI request expired.',finishedAt:now});trace(state,'model.failed',{attemptId:old.id,reason:old.error});state.pendingPlanner=null;}
 if(state.mode!=='adaptive'||['completed','failed'].includes(state.status))throw new PivotError('This run cannot request a plan.',409);
 if(state.inference.length>=6)throw new PivotError('This run has used its AI allowance.',429);
 const context=planningContext(state);const attempt={id:randomUUID(),createdAt:now,reservedTokens:3000,status:'pending',worldVersion:state.world.version,contextHash:hash(context)};
 state.inference.push(attempt);state.pendingPlanner=attempt.id;state.pendingPause=false;state.status='replanning';state.planningCalls++;
 trace(state,'model.requested',{attemptId:attempt.id,worldVersion:state.world.version,reservedTokens:3000});return{attemptId:attempt.id,context};
}
export function finishInference(state,input){
 const attempt=state.inference.find(a=>a.id===input.attemptId);
 if(!attempt||state.pendingPlanner!==attempt.id)throw new PivotError('This AI request is no longer active.',409);
 if(state.pendingPause)throw new PivotError('The run was paused. No action was applied.',409);
 if(hash(planningContext(state))!==attempt.contextHash)throw new PivotError('Evidence changed while AI was planning. Ask for a fresh plan.',409);
 validateCandidatePlan(input.candidate,state);
 const usage=input.usage;if(usage!==null&&(!Number.isSafeInteger(usage?.totalTokens)||usage.totalTokens<0||!Number.isSafeInteger(usage.inputTokens)||!Number.isSafeInteger(usage.outputTokens)||usage.totalTokens!==usage.inputTokens+usage.outputTokens))throw new PivotError('AI returned invalid usage.',502);
 state.pendingPlanner=null;Object.assign(attempt,{model:'deepseek-v4-flash',usage,candidate:input.candidate,finishedAt:Date.now(),status:'returned'});
 trace(state,'model.returned',{attemptId:attempt.id,model:attempt.model,usage,contextHash:attempt.contextHash,candidate:input.candidate});
 if(usage&&usage.totalTokens>3000){state.status='paused';state.pauseReason='AI request exceeded its token allowance.';attempt.status='reservation-exceeded';trace(state,'model.paused',{reason:state.pauseReason});return{allowed:false};}
 const result=saveRevision(state,input.candidate,'genuine DeepSeek through authenticated gateway');attempt.status=result.allowed?'accepted':'refused';return result;
}
export function failInference(state,input){
 const attempt=state.inference.find(a=>a.id===input.attemptId);
 if(!attempt||state.pendingPlanner!==attempt.id)return{stale:true};
 state.pendingPlanner=null;state.status='paused';state.pauseReason=input.reason;Object.assign(attempt,{status:'failed',error:input.reason,finishedAt:Date.now()});trace(state,'model.failed',{attemptId:attempt.id,reason:input.reason});return{failed:true};
}
export async function requestGateway(config,payload){
 const response=await fetch(config.url+'/propose',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+config.token},body:JSON.stringify(payload),redirect:'error',signal:AbortSignal.timeout(30000)});
 const reader=response.body?.getReader();let bytes=0,chunks=[];if(reader)for(;;){const next=await reader.read();if(next.done)break;bytes+=next.value.length;if(bytes>12000){await reader.cancel();throw new PivotError('AI response too large.',502);}chunks.push(next.value);}
 const buffer=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){buffer.set(chunk,offset);offset+=chunk.length;}
 if(!response.ok)throw new PivotError(response.status===429?'AI allowance is temporarily unavailable.':'AI is temporarily unavailable. No action was applied.',response.status===429?429:503);
 let data;try{data=JSON.parse(new TextDecoder().decode(buffer));}catch{throw new PivotError('AI returned an invalid response.',502);}
 if(data.model!=='deepseek-v4-flash')throw new PivotError('Unexpected AI model.',502);return data;
}
export async function runHostedPlan({store,sandboxId,runId,config,client=requestGateway}){
 const now=Date.now(),bucket='model:global:'+Math.floor(now/3600000);
 const allowance=await store.db.prepare('INSERT INTO pivot_limits(id,count,expires_at) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1 WHERE count<20 RETURNING count').bind(bucket,now+86400000).first();
 if(!allowance)throw new PivotError('Hourly AI allowance reached.',429);
 const started=await store.mutate(sandboxId,'modelStart',{runId});const attemptId=started.result.attemptId;
 try{const data=await client(config,started.result);return await store.mutate(sandboxId,'modelFinish',{runId,attemptId,candidate:data.candidate,usage:data.usage});}
 catch(error){const reason=error instanceof PivotError?error.message:'AI is temporarily unavailable. No action was applied.';await store.mutate(sandboxId,'modelFail',{runId,attemptId,reason});throw new PivotError(reason,error.status??503);}
}
