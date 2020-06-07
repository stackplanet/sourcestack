import { writeBackendConfig } from "./deploy-api";
import { fromStack } from "../infra/src/generic/stackoutput";
import { Config } from "./config";

(async () => {
    let stackOutputs = await fromStack(Config.instance.appEnv);
    await writeBackendConfig('api/src/generic', stackOutputs);
    console.log('Local server configured to use data store in ' + Config.instance.appEnv + '. Please restart the server.');
})();

