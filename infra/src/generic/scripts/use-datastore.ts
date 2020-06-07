import { Config } from "../util/config";
import { fromStack } from "../stackoutput";
import { writeBackendConfig } from "./deploy-api";

(async () => {
    let stackOutputs = await fromStack(Config.instance.appEnv);
    await writeBackendConfig('../api/src/generic', stackOutputs);
    console.log('Local server configured to use data store in ' + Config.instance.appEnv + '. Please restart the server.');
})();

