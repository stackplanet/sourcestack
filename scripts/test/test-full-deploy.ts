import { execute } from "../execute";
import { writeFileSync } from "fs";
import { fromStack } from "../../infra/src/generic/stackoutput";
import { testApp } from "../../ui/src/test/integ-test-app";

function writeConfig(config: any){
    writeFileSync(`test-override.json`, JSON.stringify(config));
}

(async () => {
    let app = 'staktest';
    let env = 'alpha1';
    writeConfig({
        'name' : app,
        'environments' : env,
    });
    await execute(`npm run destroy-env --env=${env} --configFileName=test-override.json --noConfirmDestroy`);
    await execute(`rm -rf api/dist.zip api/dist ui/dist`)
    await execute(`npm run deploy --env=${env} --configFileName=test-override.json`);
    let stackConfig = await fromStack(`${app}-${env}`);
    testApp(stackConfig.DistributionUri, stackConfig.UserPoolId);
})();