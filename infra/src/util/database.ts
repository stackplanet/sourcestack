import { Config } from "./config";
import { readStackOutputFile } from "../stackoutput";

export namespace Database {

    export async function query(conn:any, sql: string){
        console.log(sql);
        let res = await conn.query(sql, {
            continueAfterTimeout: true,
            username: 'root'
        });
        return res.records; 
    }

    export async function connect(){
        Config.ensureArgsSupplied();
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