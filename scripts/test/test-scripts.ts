import { execute } from "../execute";
import { writeFileSync } from "fs";

(async () => {
    let config = {
        'name' : 'staktest',
        'environments' : 'alpha1'
    };
    writeFileSync(`test-override.json`, JSON.stringify(config));
    await execute(`rm -rf api/dist.zip api/dist ui/dist ui/server.cert ui/server.key`)
    await execute(`STAK_CONFIG_FILE_NAME=test-override.json && npm run deploy --env=alpha1`);

})();