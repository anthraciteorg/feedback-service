import { Elysia } from 'elysia';
import { common } from './groups/common';
import { feedback } from './groups/feedback';
import { swagger } from './groups/swagger';
import { Database } from './services/database';

await Database.initialize();

const app = new Elysia()
    .use(common)
    .use(swagger)
    .use(feedback)
    .listen({ port: process.env.PORT });

console.log(`
 █████╗ ███╗   ██╗████████╗██╗  ██╗██████╗  █████╗  ██████╗██╗████████╗███████╗
██╔══██╗████╗  ██║╚══██╔══╝██║  ██║██╔══██╗██╔══██╗██╔════╝██║╚══██╔══╝██╔════╝
███████║██╔██╗ ██║   ██║   ███████║██████╔╝███████║██║     ██║   ██║   █████╗  
██╔══██║██║╚██╗██║   ██║   ██╔══██║██╔══██╗██╔══██║██║     ██║   ██║   ██╔══╝  
██║  ██║██║ ╚████║   ██║   ██║  ██║██║  ██║██║  ██║╚██████╗██║   ██║   ███████╗
╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝   ╚═╝   ╚══════╝

Feedback service is running at ${app.server?.hostname}:${app.server?.port}
`);