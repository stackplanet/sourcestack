import { fromStack } from "../infra/src/generic/stackoutput";
import { Config } from "./config";
import { execute } from "./execute";
import { appUri } from "./stack-uri";

(async () => {
    let stackOutputs = await fromStack(Config.instance.appEnv);
    await execute(`cd ui && npm run build`);
    await execute(`aws s3 sync --delete ui/dist ${stackOutputs.HostingBucket}`);
    await execute(`aws cloudfront create-invalidation --distribution-id ${stackOutputs.DistributionId} --paths "/*"`);
    console.log(Config.instance.appEnv + ' deployed to ' + await appUri());
})();