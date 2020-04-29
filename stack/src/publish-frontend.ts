import { execute } from "./util/execute";
import { writeFileSync } from "fs";
import { Config } from "./util/config";
import { StackOutputs, fromStack } from "./stackoutputs";

(async () => {
    Config.ensureArgsSupplied();
    let stackOutputs = await fromStack(Config.appEnv());
    let hostingBucket = stackOutputs.get(StackOutputs.HostingBucket);
    let distributionId = stackOutputs.get(StackOutputs.DistributionId);
    let distributionUri = stackOutputs.get(StackOutputs.DistributionUri);
    let frontendConfig = {
        app: Config.app(),
        env: Config.env(),
    }
    await execute(`cd ../frontend && npm run build`);
    writeFileSync('../frontend/dist/frontend-config.json', JSON.stringify(frontendConfig, null, 2));
    await execute(`aws s3 sync --delete ../frontend/dist ${hostingBucket}`);
    await execute(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*"`);
    console.log('Published ' + Config.appEnv() + ' to ' + distributionUri);
})();