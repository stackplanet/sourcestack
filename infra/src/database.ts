import { Config } from "./util/config";
import { getStackOutput, StackOutput } from "./stackoutput";

export namespace Database {

    export async function query(conn:any, sql: string){
        console.log(sql);
        let res = await conn.query(sql, {
            continueAfterTimeout: true,
            username: 'root',
            httpOptions: {
                connectTimeout: 120000
            }
        });
        console.log(res);
    }

    export async function connect(){
        Config.ensureArgsSupplied();
        let stackOutputs = await getStackOutput(Config.appEnv());
        let databaseArn = stackOutputs.get(StackOutput.DatabaseArn);
        let databaseSecretArn = stackOutputs.get(StackOutput.DatabaseSecretArn);
        return require('data-api-client')({
            secretArn: databaseSecretArn,
            resourceArn: databaseArn,
            database: 'main'
        });
    }


}