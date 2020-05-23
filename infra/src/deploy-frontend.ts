import { execute } from "./util/execute";
import { Config } from "./util/config";
import { fromStack } from "./stackoutput";

(async () => {
    Config.ensureArgsSupplied();
    let stackOutputs = await fromStack(Config.appEnv());
    await execute(`aws s3 sync --delete ../frontend/dist ${stackOutputs.HostingBucket}`);
    await execute(`aws cloudfront create-invalidation --distribution-id ${stackOutputs.DistributionId} --paths "/*"`);
    console.log('Published ' + Config.appEnv() + ' to ' + stackOutputs.DistributionUri);
})();