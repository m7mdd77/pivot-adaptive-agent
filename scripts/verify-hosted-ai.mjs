// Operator-only verification: this makes two genuine paid model calls.
import {mkdirSync,writeFileSync} from 'node:fs';
import {verifyTrace} from '../src/runner.js';
const base='https://pivot-adaptive-agent.choggyacc.chatgpt.site';
const response=await fetch(base+'/api/state',{signal:AbortSignal.timeout(20000)});
const cookie=response.headers.get('set-cookie')?.split(';')[0],initial=await response.json();
if(!cookie||!initial.model?.configured)throw Error('The authenticated PC worker is not online.');
async function post(operation,input){const response=await fetch(base+'/api/'+operation,{method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json','X-CSRF-Token':initial.csrf,Origin:base},body:JSON.stringify(input),signal:AbortSignal.timeout(55000)});const data=await response.json();if(!response.ok)throw Error(operation+': '+data.error);return data;}
const evidence={verifiedAt:new Date().toISOString(),url:base,transport:'Live hosted D1 job -> authenticated outbound PC worker -> supported Claude Code -> AgentRouter',scope:'Genuine model proposals; synthetic actions applied separately',runs:[]};
for(const scenarioId of ['stock-loss','eta-delay']){
 let run=await post('run',{scenarioId,mode:'adaptive'});run=await post('prepare',{runId:run.id});const priorReceipts=run.receipts.map(r=>r.id);
 run=await post('inject',{runId:run.id});run=await post('agent/plan',{runId:run.id});const attempt=run.inference.at(-1);
 if(attempt.status!=='accepted'||run.plan.supplierId!=='B'||JSON.stringify(run.receipts.map(r=>r.id))!==JSON.stringify(priorReceipts))throw Error('AI proposal failed validation or applied an automatic effect.');
 const proposal={model:attempt.model,usage:attempt.usage,candidate:attempt.candidate,receiptCountBeforeExecution:run.receipts.length};
 for(let step=0;step<8&&run.status!=='completed';step++)run=await post('advance',{runId:run.id});
 if(run.delivered!==12||run.spendCents!==26400||run.arrivalMinute!==100||!verifyTrace(run)||!priorReceipts.every(id=>run.receipts.some(r=>r.id===id)))throw Error('Goal, receipts or audit verification failed.');
 const summary={scenarioId,...proposal,delivered:run.delivered,spendCents:run.spendCents,arrivalMinute:run.arrivalMinute,compensations:run.compensations,receipts:run.receipts,auditValid:true};evidence.runs.push(summary);console.log(JSON.stringify({scenarioId,success:true,tokens:attempt.usage?.totalTokens,delivered:run.delivered,spendCents:run.spendCents,arrivalMinute:run.arrivalMinute,compensations:run.compensations}));
}
mkdirSync(new URL('../docs/evidence/',import.meta.url),{recursive:true});writeFileSync(new URL('../docs/evidence/public-live-ai.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');
