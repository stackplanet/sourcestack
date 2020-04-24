export interface UiConfig {

    api: string;

}

export namespace UiConfig {

    export let instance: UiConfig;

    export async function init(){
        let configRequest = await fetch('config.json');
        let config: UiConfig = await configRequest.json();
        UiConfig.instance = config;
    }

}