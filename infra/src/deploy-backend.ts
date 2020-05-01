import { execute } from "./util/execute";
import { writeFileSync } from "fs";
import { Config } from "./util/config";
import { StackOutput, getStackOutput } from "./stackoutput";
let jwkToPem = require('jwk-to-pem');

(async () => {
    Config.ensureArgsSupplied();
    let stackOutputs = await getStackOutput(Config.appEnv());
    await writeBackendConfig('../backend/dist', stackOutputs);
    await execute(`cd ../backend/dist && zip ../dist.zip *`);
    const functionName = stackOutputs.get(StackOutput.FunctionName);
    await execute(`aws lambda --region eu-west-1 update-function-code --function-name ${functionName} --zip-file fileb://../backend/dist.zip`);
    console.log('Published ' + functionName);
})();


export async function writeBackendConfig(dir: string, stackOutputs: Map<StackOutput, string>){
    let userPoolId = stackOutputs.get(StackOutput.UserPoolId);
    const userPoolClientId = stackOutputs.get(StackOutput.UserPoolClientId);
    let backendConfig = {
        app: Config.app(),
        env: Config.env(),
        UserPoolId: userPoolId, 
        UserPoolClientId: userPoolClientId,
        kidToPems: await getKidToPems(userPoolId as string)
    }
    writeFileSync(dir + '/backend-config.json', JSON.stringify(backendConfig, null, 2));
}

async function getKidToPems(userPoolId: string){
    let curlOutput = await execute(`curl -s https://cognito-idp.eu-west-1.amazonaws.com/${userPoolId}/.well-known/jwks.json`)
    let jwks = JSON.parse(curlOutput.stdout);
    let kidToPems:any = {};
    for (let key of jwks.keys){
        let pem = jwkToPem(key);
        kidToPems[key.kid] = pem;
    }
    return kidToPems;
}