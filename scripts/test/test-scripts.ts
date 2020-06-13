import { execute } from "../execute";
import { writeFileSync } from "fs";


function writeConfig(config: any){
    writeFileSync(`test-override.json`, JSON.stringify(config));
}

(async () => {
    writeConfig({
        'name' : 'staktest',
        'environments' : 'alpha1',
    });
    await execute(`npm run destroy-env --env=alpha1 --configFileName=test-override.json --noConfirmDestroy`);
    await execute(`rm -rf api/dist.zip api/dist ui/dist ui/server.cert ui/server.key`)
    await execute(`npm run deploy --env=alpha1 --configFileName=test-override.json`);
})();