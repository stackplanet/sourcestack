import { CloudFormation } from "aws-sdk";

export async function findStack(stackName: string) {
    let stacks = await new CloudFormation().describeStacks().promise();
    return stacks.Stacks?.find(s => s.StackName == stackName);
}

export async function stackExists(stackName: string) {
    return (await findStack(stackName)) !== undefined;
}