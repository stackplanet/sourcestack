import { Config } from "./config";
import { fromStack } from "../infra/src/generic/stackoutput";
import { execute } from "./execute";

(async () => {
    let stackOutputs = await fromStack(Config.instance.appEnv);
    execute(`sam logs -tn ${stackOutputs.FunctionName}`);
})();
