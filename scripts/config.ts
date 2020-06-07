import { existsSync } from "fs";

export class Config {
    
    static instance = new Config();
    
    app: string;
    env: string;
    appEnv: string;
    hostedZoneId: string;
    domain: string;
    certificateArn: string;
    cognitoEmailArn: string;
    production: boolean;
    
    private constructor(){
        let APP_ENV_REGEX = /^[a-zA-Z0-9_-]+$/;
        this.env = process.env.npm_config_env as string;
        if (this.env === undefined){
            this.fatal('Usage: --env=myEnvironment');
        }
        if (this.env === 'true'){
            this.fatal('Missing equals sign, please use --env=<environment>');
        }
        if (!APP_ENV_REGEX.test(this.env)){
            this.fatal('Environment name must match ' + APP_ENV_REGEX);
        }
        let configFileName = process.env.STAK_CONFIG_FILE_NAME || 'app.json';
        let config = require('../' + configFileName);
        this.app = config.name;
        if (this.app === undefined){
            this.fatal('App name not found in app.json');
        }
        if (!APP_ENV_REGEX.test(this.app)){
            this.fatal('Application name must match ' + APP_ENV_REGEX);
        }
        if (!config.environments || !config.environments.includes(this.env)){
            this.fatal(`Environment ${this.env} not allowed - the list of allowed environments in app.json is ${config.environments}`);
        }
        this.appEnv = `${this.app}-${this.env}`;
        this.hostedZoneId = config.hostedZoneId;
        this.domain = config.domain;
        this.certificateArn = config.certificateArn;
        this.production = this.env === 'production';
    }

    private fatal(msg: string){
        console.error(msg);
        process.exit(1);
    }

}