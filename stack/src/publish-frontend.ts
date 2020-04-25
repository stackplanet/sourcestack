import { execute } from "./util/execute";
import { writeFileSync } from "fs";
import { Config } from "./util/config";

(async () => {
    Config.ensureArgsSupplied();
    let cdkOut = require(`../${Config.appEnv()}.out.json`);
    let config = cdkOut[Config.appEnv()];
    let hostingBucket = config.HostingBucket;
    let distributionId = config.DistributionId;
    let apiEndpoint = config.EndpointUrl;
    let frontendConfig = {
        api: apiEndpoint
    }
    writeFileSync('../frontend/dist/config.json', JSON.stringify(frontendConfig));
    await execute(`aws s3 sync --delete ../frontend/dist ${hostingBucket}`);
    await execute(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*"`);
    console.log('Published ' + Config.appEnv() + ' to ' + config.DistributionUri);
})();