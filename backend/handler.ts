import { DynamoDB, Lambda } from 'aws-sdk';

exports.handler = async function (event: any) {
    //   let m = moment();
    //   console.log('request:', JSON.stringify(event, undefined, 2));
    //   return {
    //     statusCode: 200,
    //     headers: { 'Content-Type': 'text/plain' },
    //     body: `OH Hello, ${name} ${m} CDK! You've hit ${event.path}\n`
    //   };

    console.log("request:", JSON.stringify(event, undefined, 2));

    // // create AWS SDK clients
    const dynamo = new DynamoDB();

    // update dynamo entry for "path" with hits++
    await dynamo.updateItem({
        TableName: process.env.TABLE_NAME as string,
        Key: { path: { S: event.path } },
        UpdateExpression: 'ADD hits :incr',
        ExpressionAttributeValues: { ':incr': { N: '1' } }
    }).promise();

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: `Hello CDK! You've hit ${event.path}\n`
    };


    // call downstream function and capture response
    // const resp = await lambda.invoke({
    //     FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME as string,
    //     Payload: JSON.stringify(event)
    // }).promise();

    // console.log('downstream response:', JSON.stringify(resp, undefined, 2));

    // // return response back to upstream caller
    // return JSON.parse(resp.Payload as string);
};