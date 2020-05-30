import { readStackOutputFile } from "../stackoutput";

export namespace Database {

    export async function query(conn:any, sql: string, params?: any){
        let res = await conn.query(sql, params);
        return res.records; 
    }

    export async function connect(){
        let stackOutputs = readStackOutputFile();
        return require('data-api-client')({
            secretArn: stackOutputs.DatabaseSecretArn,
            resourceArn: stackOutputs.DatabaseArn,
            database: 'main',
            options: {
                maxRetries: 10,
                retryDelayOptions: {base: 5000},
                httpOptions: {
                    connectTimeout: 120000
                }
            }
        });
    }


}