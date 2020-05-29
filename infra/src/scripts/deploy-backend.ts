import { execute } from "../util/execute";
import { writeFileSync } from "fs";
import { Config } from "../util/config";
import { fromStack, StackOutput } from "../stackoutput";
import {BackendConfig} from '../../../backend/src/backendconfig';
let jwkToPem = require('jwk-to-pem');

(async () => {
    Config.ensureArgsSupplied();
    let stackOutputs = await fromStack(Config.appEnv());
    writeBackendConfig('../backend/dist', stackOutputs);
    await execute(`cd ../backend/dist && zip ../dist.zip *`);
    await execute(`aws lambda --region eu-west-1 update-function-code --function-name ${stackOutputs.FunctionName} --zip-file fileb://../backend/dist.zip`);
    console.log('Published ' + stackOutputs.FunctionName);
})();

export async function writeBackendConfig(dir: string, stackOutput: StackOutput){
    let backendConfig: BackendConfig = {
        app: Config.app(),
        env: Config.env(),
        UserPoolId: stackOutput.UserPoolId, 
        UserPoolClientId: stackOutput.UserPoolClientId,
        DatabaseArn: stackOutput.DatabaseArn,
        DatabaseSecretArn: stackOutput.DatabaseSecretArn,
        kidToPems: await getKidToPems(stackOutput.UserPoolId)
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