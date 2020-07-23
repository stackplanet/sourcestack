import { createServer, proxy } from 'aws-serverless-express';
import { Context } from 'aws-lambda';
import { createApp } from './main';

const app = createApp();
const server = createServer(app, undefined, []);

export const handler = (event: any, context: Context) => proxy(server, event, context);