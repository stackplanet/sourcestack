import { CloudFormation } from "aws-sdk";

export interface StackOutput {

    DistributionUri: string,
    DistributionId: string;
    HostingBucket: string;
    FunctionName: string;
    EndpointUrl: string;
    UserPoolId: string;
    UserPoolClientId: string;
}


export async function fromStack(stackName: string): Promise<StackOutput> {
    let stack = await new CloudFormation().describeStacks({StackName:stackName}).promise();
    let outputs = stack?.Stacks?.[0].Outputs as CloudFormation.Outputs;
    if (outputs === undefined){
        console.error('Stack not found');
        process.exit(1);
    }
    let output = (outputName: string) =>  outputs.find((f) => f.OutputKey == outputName)?.OutputValue as string;
    return {
        DistributionUri: output('DistributionUri'),
        DistributionId: output('DistributionId'),
        HostingBucket: output('HostingBucket'),
        FunctionName: output('FunctionName'),
        EndpointUrl: output('EndpointUrl'),
        UserPoolId: output('UserPoolId'),
        UserPoolClientId: output('UserPoolClientId'),
    }
}   
