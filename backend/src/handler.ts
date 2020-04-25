import { DynamoDB, Lambda } from 'aws-sdk';

import { createServer, proxy } from 'aws-serverless-express';
import { Context } from 'aws-lambda';
import { configureApp } from './api';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)
const binaryMimeTypes: string[] = [
  // 'application/javascript',
  // 'application/json',
  // 'application/octet-stream',
  // 'application/xml',
  // 'font/eot',
  // 'font/opentype',
  // 'font/otf',
  // 'image/jpeg',
  // 'image/png',
  // 'image/svg+xml',
  // 'text/comma-separated-values',
  // 'text/css',
  // 'text/html',
  // 'text/javascript',
  // 'text/plain',
  // 'text/text',
  // 'text/xml',
];
const app = configureApp();
const server = createServer(app, undefined, binaryMimeTypes);

export const handler = (event: any, context: Context) =>
  proxy(server, event, context);

// exports.handler = async function (event: any) {
//     //   let m = moment();
//     //   console.log('request:', JSON.stringify(event, undefined, 2));
//     //   return {
//     //     statusCode: 200,
//     //     headers: { 'Content-Type': 'text/plain' },
//     //     body: `OH Hello, ${name} ${m} CDK! You've hit ${event.path}\n`
//     //   };

//     console.log("request:", JSON.stringify(event, undefined, 2));

//     // // create AWS SDK clients
//     const dynamo = new DynamoDB();

//     // update dynamo entry for "path" with hits++
//     await dynamo.updateItem({
//         TableName: process.env.TABLE_NAME as string,
//         Key: { path: { S: event.path } },
//         UpdateExpression: 'ADD hits :incr',
//         ExpressionAttributeValues: { ':incr': { N: '1' } }
//     }).promise();

//     return {
//         statusCode: 200,
//         headers: { 'Content-Type': 'text/plain' },
//         body: `Hello CDK! You've hit ${event.path}\n`
//     };


//     // call downstream function and capture response
//     // const resp = await lambda.invoke({
//     //     FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME as string,
//     //     Payload: JSON.stringify(event)
//     // }).promise();

//     // console.log('downstream response:', JSON.stringify(resp, undefined, 2));

//     // // return response back to upstream caller
//     // return JSON.parse(resp.Payload as string);
// };