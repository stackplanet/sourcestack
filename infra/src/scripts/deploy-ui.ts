import { execute } from "../util/execute";
import { Config } from "../util/config";
import { fromStack } from "../stackoutput";

(async () => {
    let stackOutputs = await fromStack(Config.instance.appEnv);
    await execute(`cd ../ui && npm run build`);
    await execute(`aws s3 sync --delete ../ui/dist ${stackOutputs.HostingBucket}`);
    await execute(`aws cloudfront create-invalidation --distribution-id ${stackOutputs.DistributionId} --paths "/*"`);
    console.log('Published ' + Config.instance.appEnv + ' to ' + stackOutputs.DistributionUri);
})();