import { findStack } from "./stackutils";

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
    let stack = await findStack(stackName);
    if (stack === undefined){
        throw new Error(`Stack ${stackName} not found`);
    }
    let output = (outputName: string) =>  stack?.Outputs?.find((f) => f.OutputKey == outputName)?.OutputValue as string;
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
