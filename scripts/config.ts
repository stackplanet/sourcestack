export class Config {
    
    static instance = new Config();
    
    get env(){
        let ENV_REGEX = /^[a-zA-Z0-9_-]+$/;
        let env = process.env.npm_config_env as string;
        if (env === undefined){
            this.fatal('Missing required argument "env", e.g. --env=myEnvironment');
        }
        if (env === 'true'){
            this.fatal('Missing equals sign, please use --env=<environment>');
        }
        if (!ENV_REGEX.test(env)){
            this.fatal('Environment name must match ' + ENV_REGEX);
        }
        if (!this.environments.includes(env)){
            this.fatal(`Environment "${env}" not found in app.json. Allowed environments are: ${this.environments}`);
        }
        return env;
    }

    get app(){
        return this.configFileField('name', true, /^[a-zA-Z0-9_-]+$/);
    }

    get appEnv(){
        return `${this.app}-${this.env}`;
    }

    get domain() {
        return this.configFileField('domain', false, /^[\.a-zA-Z0-9_-]+$/) as string;
    }

    get subdomain(){
        if (this.production) return this.domain;
        else return this.env + '.' + this.domain;
    }

    get hostedZoneId() {
        let required = this.domain !== undefined;
        return this.configFileField('hostedZoneId', required, /^[a-zA-Z0-9_-]+$/) as string;
    }

    get certificateArn() {
        let required = this.domain !== undefined;
        return this.configFileField('certificateArn', required) as string; // TODO - regex
    }

    get cognitoEmailArn(){
        return this.configFileField('cognitoEmailArn', false) as string; // TODO - regex
    }

    get production(){
        return this.env === 'production';
    }

    get environments(){
        return this.configFileField('environments', true) as string[]; 
    }

    get noConfirmDestroy(){
        return process.env.npm_config_noConfirmDestroy !== undefined;
    }

    private get config(){
        return require(`../${this.configFileName}`);
    }

    get configFileName(){
        return this.npmCommandLineArg('configFileName') || 'app.json';
    }

    private configFileField(name: string, required: boolean, regex?: RegExp){
        let field = this.config[name];
        if (required && field === undefined) throw new Error(`Missing required field "${name}" in ${this.configFileName}`);
        if (regex !== undefined && !regex.test(field)) throw new Error(`Field "${name}" has value "${field}" which does not match regular expression ${regex} in ${this.configFileName}`);
        return field;
    }

    private fatal(msg: string){
        console.error(msg);
        process.exit(1);
    }

    private npmCommandLineArg(argName: string){
        // The parent npm process will have mixed case, e.g. configFileName, but 
        // child npm processes have lower case, e.g. configfilename
        let mixedCaseName = `npm_config_${argName}`;
        let lowerCaseName = mixedCaseName.toLowerCase();
        return process.env[mixedCaseName] || process.env[lowerCaseName]
    }

    toJSON(){
        let o: any = {};
        let methods = Object.getOwnPropertyNames(Config.prototype)
        methods.forEach(m => {
            let val = (Config.instance as any)[m];
            if (typeof(val) === 'function') return;
            if (m === 'config') return;
            o[m] = val;
        })
        return o;
    }

    toString(){
        return this.toJSON();
    }

}