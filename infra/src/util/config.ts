export class Config {

    static ensureArgsSupplied(){
        let env = this.env();
        let app = this.app();
        if (env === undefined || app === undefined){
            console.error('Usage: --app=myApplication --env=myEnvironment');
            process.exit(1);
        }
    }

    static env(){
        return process.env.npm_config_env;
    }

    static app(){
        return process.env.npm_config_app;
    }

    static appEnv(){
        return this.app() + '-' + this.env();
    }


}