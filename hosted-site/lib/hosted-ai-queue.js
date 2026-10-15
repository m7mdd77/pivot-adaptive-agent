import {timingSafeEqual} from 'node:crypto';
import {object,PivotError} from './contracts.js';

export function workerToken(env){const token=env.PIVOT_AI_WORKER_TOKEN;return typeof token==='string'&&/^[a-f0-9]{64}$/.test(token)?token:null;}
export async function workerOnline(db,env){if(!workerToken(env))return false;const row=await db.prepare('SELECT expires_at FROM pivot_limits WHERE id=?').bind('ai:worker').first();return Boolean(row&&row.expires_at>Date.now());}
async function heartbeat(db){const now=Date.now();await db.prepare('INSERT INTO pivot_limits(id,count,expires_at) VALUES (?,0,?) ON CONFLICT(id) DO UPDATE SET expires_at=excluded.expires_at').bind('ai:worker',now+15000).run();}
async function readBody(request){let text='',bytes=0;const decoder=new TextDecoder();const reader=request.body?.getReader();if(reader)for(;;){const next=await reader.read();if(next.done)break;bytes+=next.value.length;if(bytes>12000){await reader.cancel();throw new PivotError('Request too large.',413);}text+=decoder.decode(next.value,{stream:true});}text+=decoder.decode();try{return JSON.parse(text);}catch{throw new PivotError('Invalid JSON.');}}
export async function handleWorkerRequest(request,env){
 const token=workerToken(env),actual=Buffer.from(request.headers.get('authorization')??''),expected=Buffer.from('Bearer '+token);
 if(!token||actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new PivotError('Unauthorized.',401);
 if(request.method!=='POST')throw new PivotError('Method not allowed.',405);
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw new PivotError('JSON required.',415);
 const input=await readBody(request),path=new URL(request.url).pathname,db=env.DB,now=Date.now();
 if(path==='/api/ai-worker/ping'){object(input,[]);await heartbeat(db);return{online:true};}
 if(path==='/api/ai-worker/claim'){
  object(input,[]);await heartbeat(db);
  await db.prepare('DELETE FROM pivot_ai_jobs WHERE id IN (SELECT id FROM pivot_ai_jobs WHERE created_at<? LIMIT 100)').bind(now-600000).run();
  const row=await db.prepare("UPDATE pivot_ai_jobs SET status='claimed',lease_until=? WHERE id=(SELECT id FROM pivot_ai_jobs WHERE status='pending' AND created_at>? ORDER BY created_at LIMIT 1) AND status='pending' RETURNING id,payload").bind(now+35000,now-40000).first();
  return{job:row?{id:row.id,payload:JSON.parse(row.payload)}:null};
 }
 if(path==='/api/ai-worker/complete'){
  object(input,['jobId','data','failed'],['jobId']);if(!/^[a-f0-9-]{36}$/.test(input.jobId))throw new PivotError('Invalid job.');
  if(typeof input.failed!=='boolean'||input.failed&&input.data!==undefined||!input.failed&&input.data===undefined)throw new PivotError('Invalid result.');
  const result=input.failed?null:JSON.stringify(input.data);if(result&&Buffer.byteLength(result)>10000)throw new PivotError('Result too large.',413);
  const updated=await db.prepare("UPDATE pivot_ai_jobs SET status=?,result=? WHERE id=? AND status='claimed' AND lease_until>?").bind(input.failed?'failed':'completed',result,input.jobId,now).run();
  if(updated.meta.changes!==1)throw new PivotError('Job expired or already completed.',409);await heartbeat(db);return{saved:true};
 }
 throw new PivotError('Not found.',404);
}

export async function requestQueuedPlan(db,sandboxId,runId,payload,{timeoutMs=40000,pollMs=700}={}){
 const now=Date.now();await db.prepare('INSERT INTO pivot_ai_jobs(id,sandbox_id,run_id,payload,status,created_at,lease_until) VALUES (?,?,?,?,?,?,0)').bind(payload.attemptId,sandboxId,runId,JSON.stringify(payload),'pending',now).run();
 const deadline=now+timeoutMs;
 while(Date.now()<deadline){const row=await db.prepare('SELECT status,result FROM pivot_ai_jobs WHERE id=?').bind(payload.attemptId).first();
  if(row?.status==='completed'){let result;try{result=JSON.parse(row.result);}catch{throw new PivotError('AI returned an invalid response.',502);}if(result.model!=='deepseek-v4-flash')throw new PivotError('Unexpected AI model.',502);return result;}
  if(!row||row.status==='failed')throw new PivotError('AI is temporarily unavailable. No action was applied.',503);
  await new Promise(resolve=>setTimeout(resolve,pollMs));
 }
 await db.prepare("UPDATE pivot_ai_jobs SET status='failed' WHERE id=? AND status IN ('pending','claimed')").bind(payload.attemptId).run();throw new PivotError('AI took too long. No action was applied.',504);
}
