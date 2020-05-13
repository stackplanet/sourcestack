import { Config } from "./util/config";
import { getStackOutput, StackOutput } from "./stackoutput";

async function query(db:any, sql: string){
    console.log(sql);
    let res = await db.query(sql, {
        continueAfterTimeout: true,
        username: 'root'
    });
    console.log(res);
}

(async () => {
    Config.ensureArgsSupplied();
    let stackOutputs = await getStackOutput(Config.appEnv());
    let databaseArn = stackOutputs.get(StackOutput.DatabaseArn);
    let databaseSecretArn = stackOutputs.get(StackOutput.DatabaseSecretArn);
    let db = require('data-api-client')({
        secretArn: databaseSecretArn,
        resourceArn: databaseArn,
        database: 'main'

    });
    
    await query(db, `create table if not exists todos (    
        \`id\` int not null auto_increment,
        \`userid\` varchar(100) not null,
        \`value\` varchar(1000) not null,
        \`created\` datetime not null default current_timestamp,
        \`status\` varchar(20) not null,
        primary key (\`id\`)
    );`)
    await query(db, `insert into todos (userid, value, status) values ('martin', 'Wash dishes', 'active');`);
})();

