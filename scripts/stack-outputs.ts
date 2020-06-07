import { Config } from "./config";
import { fromStack } from "../infra/src/generic/stackoutput";

(async () => {
    let stackOutputs = await fromStack(Config.instance.appEnv);
    console.log(stackOutputs);
})();
