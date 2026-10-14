import test from 'node:test';import assert from 'node:assert/strict';import {DatabaseSync} from 'node:sqlite';import {readFileSync} from 'node:fs';import {HostedStore,newSandbox,mutateSandbox} from '../hosted/store.js';import {metrics} from '../src/comparison.js';import worker from '../hosted/worker.js';
function d1(){
 const db=new DatabaseSync(':memory:');
 db.exec(readFileSync(new URL('../hosted/schema.sql',import.meta.url),'utf8'));
 return {db,prepare(sql){
  const statement=db.prepare(sql);
  return {bind(...values){
   return {
    async first(){return statement.get(...values)??null;},
    async run(){const result=statement.run(...values);return {meta:{changes:Number(result.changes)}};}
   };
  }};
 }};
}
for(const scenarioId of ['stock-loss','eta-delay','unsafe-revision','noise'])test(`hosted pure adapter preserves ${scenarioId} policy and receipts`,()=>{const sandbox=newSandbox();const{state}=mutateSandbox(sandbox,'run',{scenarioId,mode:'adaptive'});mutateSandbox(sandbox,'prepare',{runId:state.id});mutateSandbox(sandbox,'inject',{runId:state.id});for(let i=0;i<8&&!['completed','paused'].includes(state.status);i++)mutateSandbox(sandbox,'advance',{runId:state.id});assert.equal(metrics(state).goalAchieved,scenarioId!=='unsafe-revision');assert.equal(state.spendCents,scenarioId==='noise'?22800:scenarioId==='unsafe-revision'?0:26400);});
test('D1 compare-and-swap serializes concurrent receipt attempts and rejects cross-sandbox IDs',async()=>{const adapter=d1();try{const store=new HostedStore(adapter);const row=await store.create();const run=(await store.mutate(row.id,'run',{scenarioId:'stock-loss',mode:'adaptive'})).state;const results=await Promise.all(Array.from({length:3},()=>store.mutate(row.id,'step',{runId:run.id,planId:run.plan.id,step:0})));assert.equal(new Set(results.map(r=>r.result.receipt.id)).size,1);assert.equal((await store.read(row.id)).sandbox.runs[0].receipts.length,1);const other=await store.create();await assert.rejects(store.mutate(other.id,'advance',{runId:run.id}),/not found/);}finally{adapter.db.close();}});
test('hosted HTTP boundary enforces CSRF/origin and exposes no paid model call',async()=>{const adapter=d1();try{const env={DB:adapter};const first=await worker.fetch(new Request('https://pivot.example/api/state'),env);assert.equal(first.status,200);const initial=await first.json();const cookie=first.headers.get('set-cookie').split(';')[0];const post=(path,data,extra={})=>worker.fetch(new Request('https://pivot.example'+path,{method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json','X-CSRF-Token':initial.csrf,...extra},body:JSON.stringify(data)}),env);assert.equal((await post('/api/run',{scenarioId:'stock-loss',mode:'adaptive'},{'X-CSRF-Token':''})).status,403);assert.equal((await post('/api/run',{scenarioId:'stock-loss',mode:'adaptive'},{Origin:'https://evil.example'})).status,403);assert.equal((await post('/api/agent/plan',{runId:'none'})).status,503);assert.equal(initial.model.configured,false);}finally{adapter.db.close();}});
