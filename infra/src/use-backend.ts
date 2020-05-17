import { Config } from "./util/config";
import { getStackOutput } from "./stackoutput";
import { writeBackendConfig } from "./deploy-backend";

(async () => {
    Config.ensureArgsSupplied();
    console.log('Using backend ' + Config.appEnv())
    let stackOutputs = await getStackOutput(Config.appEnv());
    await writeBackendConfig('../backend/src', stackOutputs);
    console.log('Local server configured to use backend ' + Config.appEnv() + '. Please restart the server.');
})();

