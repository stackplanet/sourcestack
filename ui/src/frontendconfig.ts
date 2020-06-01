export interface FrontendConfig {

    api: string;

}

export namespace FrontendConfig {

    export let instance: FrontendConfig;

    export async function init(){
        let configRequest = await fetch('frontend-config.json');
        let config: FrontendConfig = await configRequest.json();
        FrontendConfig.instance = config;
    }

}