import {existsSync} from 'node:fs';
import {PivotError} from './contracts.js';
import {invokeCerebras,cerebrasConfig} from './cerebras-client.js';
export function modelConfig(env=process.env){try{return cerebrasConfig(env);}catch{throw new PivotError('Configure the approved Cerebras endpoint, model and key file.',503);}}
export function publicModelConfig(config){return{configured:config.configured,model:config.model,transport:'Cerebras HTTPS API',scope:'Local paid inference; separate policy and execution',maxAttemptsPerRun:6,reservedTokensPerAttempt:12000};}
export async function callModel(config,messages,directory){if(!config.configured)throw new PivotError('Local AI is not configured.',503);const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),25000);try{return await invokeCerebras({config,messages,directory,signal:controller.signal});}finally{clearTimeout(timer);}}
