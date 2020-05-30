import { Config } from "../util/config";
import { fromStack, writeStackOutputFile } from "../stackoutput";
import { writeBackendConfig } from "./deploy-backend";

(async () => {
    console.log('Using backend ' + Config.instance.appEnv)
    let stackOutputs = await fromStack(Config.instance.appEnv);
    await writeBackendConfig('../backend/src', stackOutputs);
    writeStackOutputFile(stackOutputs);
    console.log('Local server configured to use backend ' + Config.instance.appEnv + '. Please restart the server.');
})();

