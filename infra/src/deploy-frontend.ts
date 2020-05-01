import { execute } from "./util/execute";
import { Config } from "./util/config";
import { StackOutput, getStackOutput } from "./stackoutput";

(async () => {
    Config.ensureArgsSupplied();
    let stackOutputs = await getStackOutput(Config.appEnv());
    let hostingBucket = stackOutputs.get(StackOutput.HostingBucket);
    let distributionId = stackOutputs.get(StackOutput.DistributionId);
    let distributionUri = stackOutputs.get(StackOutput.DistributionUri);
    await execute(`aws s3 sync --delete ../frontend/dist ${hostingBucket}`);
    await execute(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*"`);
    console.log('Published ' + Config.appEnv() + ' to ' + distributionUri);
})();