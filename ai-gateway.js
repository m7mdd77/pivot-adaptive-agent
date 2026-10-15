import {AgentError} from './src/agent-error.js';
import http from 'node:http';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,existsSync,readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {modelConfig,callDeepSeek} from './src/deepseek-client.js';
import {plannerMessages,reportedUsage} from './src/planner-contract.js';
import {object,validateGoal,validateCandidatePlan,hash,PivotError} from './src/contracts.js';
import {GOAL} from './src/world.js';

export function createGateway({config,token,directory,db,client=callDeepSeek}){
 db.exec('CREATE TABLE IF NOT EXISTS calls(id TEXT PRIMARY KEY,created_at INTEGER NOT NULL)');
 let busy=false;
 const authorized=request=>{const value=request.headers.authorization??'';const expected='Bearer '+token;const a=Buffer.from(value),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b);};
 const reply=(res,status,body)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body));};
 return http.createServer(async(req,res)=>{let acquired=false;try{
  if(!authorized(req))throw new PivotError('Unauthorized.',401);
  if(req.method==='GET'&&req.url==='/health'){reply(res,200,{ready:config.configured});return;}
  if(req.method!=='POST'||req.url!=='/propose')throw new PivotError('Not found.',404);
  if(!config.configured)throw new PivotError('AI is unavailable.',503);
  if(!req.headers['content-type']?.startsWith('application/json'))throw new PivotError('JSON required.',415);
  let raw='',bytes=0;for await(const chunk of req){bytes+=chunk.length;if(bytes>6000)throw new PivotError('Request too large.',413);raw+=chunk;}
  let input;try{input=JSON.parse(raw);}catch{throw new PivotError('Invalid JSON.');}
  object(input,['attemptId','context']);if(!/^[a-f0-9-]{36}$/.test(input.attemptId))throw new PivotError('Invalid attempt.');
  const context=input.context;object(context,['goal','goalHash','world','reservation','completedSteps']);validateGoal(context.goal);
  if(hash(context.goal)!==hash(GOAL)||context.goalHash!==hash(GOAL))throw new PivotError('The mission cannot change.');
  if(!Array.isArray(context.completedSteps)||context.completedSteps.length>20||context.completedSteps.some(s=>!['reserve','cancel','collect','dispatch','confirm'].includes(s)))throw new PivotError('Invalid completed steps.');
  const state={...context,receipts:context.completedSteps.map(kind=>({kind}))};const messages=plannerMessages(state);
  if(busy)throw new PivotError('AI is handling another request. Try again shortly.',429);
  const now=Date.now();db.prepare('DELETE FROM calls WHERE created_at<?').run(now-86400000);
  if(db.prepare('SELECT id FROM calls WHERE id=?').get(input.attemptId))throw new PivotError('This attempt has already been used.',409);
  if(db.prepare('SELECT COUNT(*) AS n FROM calls WHERE created_at>?').get(now-3600000).n>=20)throw new PivotError('Hourly AI allowance reached.',429);
  db.prepare('INSERT INTO calls VALUES (?,?)').run(input.attemptId,now);busy=true;acquired=true;
  const response=await client(config,messages,directory);const body=response.content?.filter(c=>c.type==='text').map(c=>c.text).join('')??'';
  if(Buffer.byteLength(body)>8000)throw new PivotError('AI response too large.',502);
  let candidate;try{candidate=JSON.parse(body);}catch{throw new PivotError('AI returned an invalid plan.',502);}
  validateCandidatePlan(candidate,state);reply(res,200,{candidate,usage:reportedUsage(response.usage),model:config.model});
 }catch(error){reply(res,error.status??502,{error:error instanceof PivotError||error instanceof AgentError?error.message:'AI could not return a plan. No action was applied.'});}finally{if(acquired)busy=false;}});
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const root=dirname(fileURLToPath(import.meta.url)),directory=join(root,'data/ai-gateway');mkdirSync(directory,{recursive:true});
 const tokenFile=join(directory,'token');if(!existsSync(tokenFile))writeFileSync(tokenFile,randomBytes(32).toString('hex'),{mode:0o600});
 const server=createGateway({config:modelConfig(),token:readFileSync(tokenFile,'utf8').trim(),directory,db:new DatabaseSync(join(directory,'budget.sqlite'))});
 server.listen(3263,'127.0.0.1',()=>console.log('Pivot AI gateway listening on 127.0.0.1:3263'));
}
