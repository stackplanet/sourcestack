import { CloudFormation, config } from "aws-sdk";

export async function findStack(stackName: string) {
    checkEnv();
    let stacks = await new CloudFormation().describeStacks().promise();
    return stacks.Stacks?.find(s => s.StackName == stackName);
}

export async function stackExists(stackName: string) {
    return (await findStack(stackName)) !== undefined;
}

export function getRegion(){
    checkEnv();
    return config.region;
}

export function checkEnv(){
    if (!process.env.AWS_SDK_LOAD_CONFIG){
        console.error('Missing configuration. Please run the following: export AWS_SDK_LOAD_CONFIG=1');
        process.exit(1);
    }
}