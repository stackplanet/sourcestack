
export class Config {
    
    static instance = new Config();
    
    app: string;
    env: string;
    appEnv: string;
    hostedZoneId: string;
    domain: string;
    certificateArn: string;
    production: boolean;

    private constructor(){
        this.env = process.env.npm_config_env as string;
        if (this.env === undefined){
            console.error('Usage: --env=myEnvironment');
            process.exit(1);
        }
        if (this.env === 'true'){
            console.error('Missing equals sign, please use --env=<environment>');
            process.exit(1);
        }
        let config = require('../../../app.json');
        this.app = config.name;
        if (this.app === undefined){
            console.error('App name not found in stak.json');
            process.exit(1);
        }
        this.appEnv = `${this.app}-${this.env}`;
        this.hostedZoneId = config.hostedZoneId;
        this.domain = config.domain;
        this.certificateArn = config.certificateArn;
        this.production = this.env === 'production';
    }

}