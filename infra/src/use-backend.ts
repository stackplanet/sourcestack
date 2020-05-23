import { Config } from "./util/config";
import { fromStack, writeStackOutputFile } from "./stackoutput";
import { writeBackendConfig } from "./deploy-backend";

(async () => {
    Config.ensureArgsSupplied();
    console.log('Using backend ' + Config.appEnv())
    let stackOutputs = await fromStack(Config.appEnv());
    await writeBackendConfig('../backend/src', stackOutputs);
    writeStackOutputFile(stackOutputs);
    console.log('Local server configured to use backend ' + Config.appEnv() + '. Please restart the server.');
})();

