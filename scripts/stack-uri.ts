import { Config } from "./config";
import { fromStack } from "../infra/src/generic/stackoutput";

export async function appUri(){
    let stackOutputs = await fromStack(Config.instance.appEnv);
    return Config.instance.domain ? 
        'https://' + Config.instance.subdomain 
        :
        stackOutputs.DistributionUri;
}
    
(async () => {        
    console.log(Config.instance.appEnv + ' deployed to ' + await appUri());
})();
