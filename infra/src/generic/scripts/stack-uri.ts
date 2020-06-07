import { fromStack } from "../stackoutput";
import { Config } from "../util/config";

(async () => {
    let stackOutputs = await fromStack(Config.instance.appEnv);
    let uri = Config.instance.domain ? 
        'https://' + Config.instance.env + '.' + Config.instance.domain 
        :
        stackOutputs.DistributionUri;
    console.log(Config.instance.appEnv + ' deployed to ' + uri);
})();
