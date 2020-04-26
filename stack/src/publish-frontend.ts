import { execute } from "./util/execute";
import { writeFileSync } from "fs";
import { Config } from "./util/config";
import { StackOutput } from "./stackoutput";

(async () => {
    Config.ensureArgsSupplied();
    let cdkOut = require(`../${Config.appEnv()}.out.json`);
    let stackOutput = cdkOut[Config.appEnv()] as StackOutput;
    let frontendConfig = {
        app: Config.app(),
        env: Config.env(),
        api: stackOutput.EndpointUrl
    }
    await execute(`cd ../frontend && npm run build`);
    writeFileSync('../frontend/dist/frontend-config.json', JSON.stringify(frontendConfig, null, 2));
    await execute(`aws s3 sync --delete ../frontend/dist ${stackOutput.HostingBucket}`);
    await execute(`aws cloudfront create-invalidation --distribution-id ${stackOutput.DistributionId} --paths "/*"`);
    console.log('Published ' + Config.appEnv() + ' to ' + stackOutput.DistributionUri);
})();