import { execute } from "./util/execute";
import { writeFileSync } from "fs";
import { Config } from "./util/config";
import { StackOutput, getStackOutput } from "./stackoutput";
let jwkToPem = require('jwk-to-pem');

(async () => {
    Config.ensureArgsSupplied();
    console.log('Using backend ' + Config.appEnv())
    let stackOutputs = await getStackOutput(Config.appEnv());
    await writeBackendConfig('../backend/src', stackOutputs);
    console.log('Local server configured to use backend ' + Config.appEnv() + '. Please restart the server.');
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