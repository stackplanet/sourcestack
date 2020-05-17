import * as express from 'express';
import { BackendConfig } from './backendconfig';

export class DataApi {

    private static dataApi: any;

    static init(){
        let config = BackendConfig.instance;
        DataApi.dataApi = require('data-api-client')({
            secretArn: config.DatabaseSecretArn,
            resourceArn: config.DatabaseArn,
            database: 'main'
        });
    }

    static async query(res: express.Response, sql: string, data?: any){
        try {
            let result = await DataApi.dataApi.query(sql, data);
            res.send(result.records);
        } catch (err){
            console.log(err);
            res.status(500);
            res.send(err);
        }
    }
}