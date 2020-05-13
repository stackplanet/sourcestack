import { CloudFormation } from "aws-sdk";

export enum StackOutput {
    DistributionUri = 'DistributionUri',
    DistributionId = 'DistributionId',
    HostingBucket = 'HostingBucket',
    FunctionName = 'FunctionName',
    EndpointUrl = 'EndpointUrl',
    UserPoolId = 'UserPoolId',
    UserPoolClientId = 'UserPoolClientId',
    DatabaseArn = 'DatabaseArn',
    DatabaseSecretArn = 'DatabaseSecretArn'
}


export async function getStackOutput(stackName: string) {
    let stack = await new CloudFormation().describeStacks({StackName:stackName}).promise();
    let outputs = stack?.Stacks?.[0].Outputs as CloudFormation.Outputs;
    if (outputs === undefined){
        console.error('Stack not found');
        process.exit(1);
    }
    let result = new Map<StackOutput, string>();
    Object.keys(StackOutput).forEach((outputName:string) => {
        let value = outputs.find((f) => f.OutputKey == outputName)?.OutputValue;
        if (value === undefined) throw new Error('No such output in stack: ' + outputName);
        result.set(outputName as StackOutput, value);
    });
    return result;
}   
