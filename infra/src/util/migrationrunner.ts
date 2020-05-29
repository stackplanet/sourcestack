import { Database } from "./database";

export class MigrationRunner {

    static TABLE_NAME = 'stak_migrations';

    conn: any;
    appliedMigrations: {id:number}[];

    async init(){
        this.conn = await Database.connect();
        await Database.query(this.conn, `create table if not exists ${MigrationRunner.TABLE_NAME} (
            id int not null,
            created datetime not null default current_timestamp,
            statement text not null
        );`);
        this.appliedMigrations = await Database.query(this.conn, `select * from ${MigrationRunner.TABLE_NAME}`);
        console.log('RUNNING DATABASE MIGRATIONS');
    }

    async run(id: number, sql: string){
        if (this.appliedMigrations.find(m => m.id === id)){
            console.log(id + ': already applied, skipping');
        }
        else {
            console.log('Running ' + sql)
            await this.conn.transaction()
                .query(sql)
                .query(`insert into ${MigrationRunner.TABLE_NAME} (id, statement) values (:id, :sql)`, {id: id, sql: sql})
                .rollback((e:any,status:any) => {console.error(`Failed to apply migration ${id}: error ${e}, status ${status}`)})
                .commit();
            console.log(id + ': successfully applied');
        }
    }

}