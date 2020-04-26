import { execute } from "./util/execute";
import { writeFileSync } from "fs";
import { Config } from "./util/config";

(async () => {
    Config.ensureArgsSupplied();
    let cdkOut = require(`../${Config.appEnv()}.out.json`);
    let config = cdkOut[Config.appEnv()];
    let frontendConfig = {
        app: Config.app(),
        env: Config.env(),
        api: config.EndpointUrl
    }
    writeFileSync('../frontend/dist/frontend-config.json', JSON.stringify(frontendConfig, null, 2));
    await execute(`aws s3 sync --delete ../frontend/dist ${config.HostingBucket}`);
    await execute(`aws cloudfront create-invalidation --distribution-id ${config.DistributionId} --paths "/*"`);
    console.log('Published ' + Config.appEnv() + ' to ' + config.DistributionUri);
})();