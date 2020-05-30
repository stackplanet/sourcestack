export interface BackendConfig {
    app: string;
    env: string;
    UserPoolId: string;
    UserPoolClientId: string;
    kidToPems: any;
    DatabaseArn: string;
    DatabaseSecretArn: string;
}
export declare namespace BackendConfig {
    let instance: BackendConfig;
    function init(): void;
}
