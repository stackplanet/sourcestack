import { execute } from "./util/execute";
import { writeFileSync } from "fs";
import { Config } from "./util/config";
import { StackOutputs, fromStack } from "./stackoutputs";
let jwkToPem = require('jwk-to-pem');

(async () => {
    Config.ensureArgsSupplied();
    let stackOutputs = await fromStack(Config.appEnv());
    let userPoolId = stackOutputs.get(StackOutputs.UserPoolId);
    const userPoolClientId = stackOutputs.get(StackOutputs.UserPoolClientId);
    let backendConfig = {
        app: Config.app(),
        env: Config.env(),
        UserPoolId: userPoolId,
        UserPoolClientId: userPoolClientId,
        kidToPems: await getKidToPems(userPoolId as string)
    }
    await execute(`cd ../backend && npm run build`);
    writeFileSync('../backend/dist/backend-config.json', JSON.stringify(backendConfig, null, 2));
    await execute(`cd ../backend/dist && zip ../dist.zip *`);
    const functionName = stackOutputs.get(StackOutputs.FunctionName);
    await execute(`aws lambda --region eu-west-1 update-function-code --function-name ${functionName} --zip-file fileb://../backend/dist.zip`);
    console.log('Published ' + functionName);
})();


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