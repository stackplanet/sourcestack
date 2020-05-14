import { Database } from "./database";

(async () => {
    
    let conn = await Database.connect();
    
    await Database.query(conn, `create table if not exists todos (    
        \`id\` int not null auto_increment,
        \`userid\` varchar(100) not null,
        \`value\` varchar(1000) not null,
        \`created\` datetime not null default current_timestamp,
        \`status\` varchar(20) not null,
        primary key (\`id\`)
    );`)
    await Database.query(conn, `insert into todos (userid, value, status) values ('martin', 'Wash dishes', 'active');`);
})();

