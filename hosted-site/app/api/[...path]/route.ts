import {env} from 'cloudflare:workers';
import worker from '../../../lib/hosted-worker.js';
export const dynamic='force-dynamic';
export async function GET(request:Request){return worker.fetch(request,env);}
export async function POST(request:Request){return worker.fetch(request,env);}
