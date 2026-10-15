import {startInference,finishInference,failInference} from './inference.js';
import {randomUUID} from 'node:crypto';import {PivotError,hash} from '../src/contracts.js';import {createRun,trace,observeInvalidation,advance,saveRevision,verifyTrace} from '../src/runner.js';import {applyEvent,scenarioEvent,SCENARIOS} from '../src/world.js';import {applySyntheticStep} from '../src/actions.js';
function boundedPayload(sandbox){const payload=JSON.stringify(sandbox);if(new TextEncoder().encode(payload).byteLength>1500000)throw new PivotError('Sandbox storage allowance exhausted.',429);return payload;}
export function newSandbox(){return{runs:[],posts:0,postWindow:Date.now()};}
function runIn(sandbox,id){const run=sandbox.runs.find(r=>r.id===id);if(!run)throw new PivotError('Run not found.',404);if(hash(run.goal)!==run.goalHash||!verifyTrace(run))throw new PivotError('Run integrity failed.',409);return run;}
export function mutateSandbox(sandbox,operation,input){if(Date.now()-sandbox.postWindow>3600000){sandbox.posts=0;sandbox.postWindow=Date.now();}if(++sandbox.posts>200)throw new PivotError('Sandbox mutation budget exhausted.',429);if(operation==='run'){if(sandbox.runs.length>=12)throw new PivotError('Sandbox run quota exhausted.',429);const state=createRun(input.scenarioId,input.mode);state.runVersion=1;sandbox.runs.push(state);return{state};}const state=runIn(sandbox,input.runId);let result;
if(operation==='prepare'){if(SCENARIOS[state.scenarioId].prepareReservation&&state.receipts.length===0){state.world.minute=5;trace(state,'clock.advanced',{minute:5});result=applySyntheticStep(state,state.plan.id,0);}else result={ready:true};}
else if(operation==='inject'||operation==='events'){const event=operation==='inject'?scenarioEvent(state):input.event;result=applyEvent(state,event);if(result.accepted)observeInvalidation(state,result.event);else{if(state.rejectedEvents>=30)throw new PivotError('Rejected-event quota exhausted.',429);state.rejectedEvents++;trace(state,'event.rejected',{eventId:event.id,reason:result.reason,replay:Boolean(result.replay)});}}
else if(operation==='advance'){result=advance(state);if(result.ready)result=applySyntheticStep(state,result.planId,result.step);}
else if(operation==='step')result=applySyntheticStep(state,input.planId,input.step);
else if(operation==='revise')result=saveRevision(state,input.candidate,'explicit demo review');
else if(operation==='modelStart')result=startInference(state);
else if(operation==='modelFinish')result=finishInference(state,input);
else if(operation==='modelFail')result=failInference(state,input);
else if(operation==='pause'){if(state.status==='completed')throw new PivotError('Completed runs cannot be paused.',409);state.status='paused';state.pendingPause=true;state.pauseReason='The run was paused.';trace(state,'operator.paused',{reason:state.pauseReason});result={paused:true};}
else throw new PivotError('Unsupported hosted operation.',404);
if(hash(state.goal)!==state.goalHash||!verifyTrace(state)||state.spendCents+state.heldCents>state.goal.budgetCents||state.delivered>state.goal.quantity)throw new PivotError('Run invariant failed.',409);state.runVersion++;return{state,result};}
export class HostedStore{
 constructor(db){this.db=db;}
 async read(id){const row=await this.db.prepare('SELECT * FROM pivot_sandboxes WHERE id=? AND expires_at>?').bind(id,Date.now()).first();return row?{...row,sandbox:JSON.parse(row.payload)}:null;}
 async create(){const id=randomUUID(),csrf=randomUUID(),now=Date.now(),payload=boundedPayload(newSandbox());await this.db.prepare('DELETE FROM pivot_sandboxes WHERE id IN (SELECT id FROM pivot_sandboxes WHERE expires_at<=? LIMIT 25)').bind(now).run();await this.db.prepare('DELETE FROM pivot_limits WHERE id IN (SELECT id FROM pivot_limits WHERE expires_at<=? LIMIT 100)').bind(now).run();await this.db.prepare('INSERT INTO pivot_sandboxes(id,csrf,revision,created_at,expires_at,payload) VALUES (?,?,1,?,?,?)').bind(id,csrf,now,now+604800000,payload).run();return this.read(id);}
 async mutate(id,operation,input){for(let retry=0;retry<3;retry++){const row=await this.read(id);if(!row)throw new PivotError('Sandbox expired.',401);const result=mutateSandbox(row.sandbox,operation,input);const updated=await this.db.prepare('UPDATE pivot_sandboxes SET payload=?,revision=revision+1 WHERE id=? AND revision=? AND expires_at>?').bind(boundedPayload(row.sandbox),id,row.revision,Date.now()).run();if(updated.meta.changes===1)return result;}throw new PivotError('Concurrent change. Reload current evidence.',409);}
}
