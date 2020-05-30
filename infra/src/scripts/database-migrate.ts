import { MigrationRunner } from "../util/migrationrunner";

(async () => {

    let runner = new MigrationRunner();
    await runner.init();

    await runner.run(1, [`create database if not exists staklist character set utf8mb4 collate utf8mb4_unicode_ci;`]);  

    await runner.run(2, [
        `drop table if exists staklist.todos;`,
        `create table staklist.todos (  
            \`id\` int not null auto_increment,
            \`userid\` varchar(100) not null,
            \`value\` varchar(1000) not null,
            \`created\` datetime not null default current_timestamp,
            primary key (\`id\`)
        );`]);
})();

