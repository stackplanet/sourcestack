import { Config } from "./config";

import promptSync from 'prompt-sync';
import { fromStack } from "../infra/src/generic/stackoutput";
import { execute } from "./execute";
import { stackExists } from "../infra/src/generic/stackutils";

async function destroyStack(){
    let stackOutputs = await fromStack(Config.instance.appEnv);
    await execute(`aws s3 rm --recursive ${stackOutputs.HostingBucket}`, false);
    await execute(`aws dynamodb delete-table --table-name ${Config.instance.appEnv}-todos`, false);
    await execute(`cd infra && npx cdk destroy --force ${Config.instance.appEnv}`, true);
    console.log(`Stack ${Config.instance.appEnv} destroyed`);
}

async function confirmAndDestroy(){
    let p = promptSync({sigint: true});
    let env = Config.instance.env;
    if (Config.instance.noConfirmDestroy) await destroyStack();
    else {
        console.log();
        console.log(`*** This will COMPLETELY DELETE environment "${env}" and ALL ASSOCIATED DATA! ***`);
        console.log();
        console.log(`To confirm, please type Y and press return`);
        let input = p('> ')
        if (input?.toLowerCase() === 'y'){
            console.log('OK, deleting');
            await destroyStack();
        }
        else {
            console.log('Exiting');
            process.exit(1);
        }
    }
}

(async() => {
    let exists = await stackExists(Config.instance.appEnv);
    if (!exists) {
        console.log(`Stack ${Config.instance.appEnv} does not exist, nothing to do`);
    }
    else {
        await confirmAndDestroy();
    }
})();
