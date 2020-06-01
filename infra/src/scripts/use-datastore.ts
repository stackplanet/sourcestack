import { Config } from "../util/config";
import { fromStack, writeStackOutputFile } from "../stackoutput";
import { writeBackendConfig } from "./deploy-backend";

(async () => {
    let stackOutputs = await fromStack(Config.instance.appEnv);
    await writeBackendConfig('../api/src', stackOutputs);
    writeStackOutputFile(stackOutputs);
    console.log('Local server configured to use data store in ' + Config.instance.appEnv + '. Please restart the server.');
})();

