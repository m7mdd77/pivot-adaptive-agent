import {DatabaseSync} from 'node:sqlite';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {createGateway} from './ai-gateway.js';
import {modelConfig} from './src/deepseek-client.js';

const root=dirname(fileURLToPath(import.meta.url)),directory=join(root,'data/ai-gateway');mkdirSync(directory,{recursive:true});
const tokenFile=join(directory,'token');if(!existsSync(tokenFile))writeFileSync(tokenFile,randomBytes(32).toString('hex'),{mode:0o600});
const token=readFileSync(tokenFile,'utf8').trim(),site='https://pivot-adaptive-agent.choggyacc.chatgpt.site';
const config=modelConfig();if(!config.configured)throw Error('The existing local AI configuration is required.');
const db=new DatabaseSync(join(directory,'budget.sqlite')),gateway=createGateway({config,token,directory,db});
await new Promise(resolve=>gateway.listen(3263,'127.0.0.1',resolve));
async function remote(path,body){const response=await fetch(site+'/api/ai-worker/'+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(body),redirect:'error',signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('Connection unavailable ('+response.status+').');return response.json();}
const timer=setInterval(()=>remote('ping',{}).catch(()=>{}),5000);
let stopping=false;for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{stopping=true;clearInterval(timer);gateway.close();});
console.log('Pivot AI worker started. Connecting to the public site.');let online=false;
while(!stopping){try{const {job}=await remote('claim',{});if(!online){console.log('Pivot AI worker connected.');online=true;}
 if(job){let body;try{const response=await fetch('http://127.0.0.1:3263/propose',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(job.payload),signal:AbortSignal.timeout(30000)});const data=await response.json();if(!response.ok)console.log(JSON.stringify({aiStatus:response.status,reason:data.error}));body=response.ok?{jobId:job.id,failed:false,data}:{jobId:job.id,failed:true};}catch{body={jobId:job.id,failed:true};}
  for(let attempt=0;attempt<2;attempt++){try{await remote('complete',body);break;}catch{if(attempt===0)await new Promise(resolve=>setTimeout(resolve,1000));}}
  console.log(body.failed?'Planning request failed safely.':'Planning result delivered.');
 }
 }catch{if(online){console.log('Connection interrupted; waiting to reconnect.');online=false;}}
 if(!stopping)await new Promise(resolve=>setTimeout(resolve,2000));
}
db.close();
