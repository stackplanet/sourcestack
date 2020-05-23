import { MigrationRunner } from "./migrationrunner";

(async () => {

    let runner = new MigrationRunner();
    await runner.init();
    await runner.run(1, `create table if not exists todos (  
        \`id\` int not null auto_increment,
        \`userid\` varchar(100) not null,
        \`value\` varchar(1000) not null,
        \`created\` datetime not null default current_timestamp,
        \`status\` varchar(20) not null,
        primary key (\`id\`)
    );`);
    
})();

