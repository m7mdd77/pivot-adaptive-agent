import type {ReactNode} from 'react';
export const metadata={title:'Pivot — The Adaptive Agent',description:'An event-driven fulfillment agent that changes its plan while keeping the same goal.'};
export default function Layout({children}:{children:ReactNode}){return <html lang="en"><head><link rel="stylesheet" href="/style.css"/><script type="module" src="/app.js"/></head><body>{children}</body></html>;}
