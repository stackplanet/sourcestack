import { fromStack } from "../stackoutput";
import { Config } from "../util/config";

(async () => {
    let stackOutputs = await fromStack(Config.instance.appEnv);
    console.log(stackOutputs);
})();
