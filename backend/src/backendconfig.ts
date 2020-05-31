import { readFileSync, existsSync } from "fs";

export interface BackendConfig {

    app: string;
    env: string;
    UserPoolId: string;
    UserPoolClientId: string;
    kidToPems: any;
}

export namespace BackendConfig {
    
    export let instance: BackendConfig;
    
    export function init(){
        const filename = __dirname + '/backend-config.json';
        if (!existsSync(filename)){
            throw new Error(filename + ' not found. Please ensure that you have run "npm run publish-backend"')
        }
        let file = readFileSync(filename);
        let config = JSON.parse(file.toString());
        BackendConfig.instance = config;
    }

}
