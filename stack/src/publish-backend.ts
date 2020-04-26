import { execute } from "./util/execute";
import { writeFileSync } from "fs";
import { Config } from "./util/config";
import { StackOutput } from "./stackoutput";
let jwkToPem = require('jwk-to-pem');

(async () => {
    Config.ensureArgsSupplied();
    let cdkOut = require(`../${Config.appEnv()}.out.json`);
    let stackOutput = cdkOut[Config.appEnv()] as StackOutput;
    let backendConfig = {
        app: Config.app(),
        env: Config.env(),
        UserPoolId: stackOutput.UserPoolId,
        UserPoolClientId: stackOutput.UserPoolClientId,
        kidToPems: await getKidToPems(stackOutput.UserPoolId)
    }
    await execute(`cd ../backend && npm run build`);
    writeFileSync('../backend/dist/backend-config.json', JSON.stringify(backendConfig, null, 2));
    await execute(`cd ../backend/dist && zip ../dist.zip *`);
    await execute(`aws lambda --region eu-west-1 update-function-code --function-name ${stackOutput.FunctionName} --zip-file fileb://../backend/dist.zip`);
    console.log('Published ' + stackOutput.FunctionName);
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