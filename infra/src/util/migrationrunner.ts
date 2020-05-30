import { Database } from "./database";
import { Config } from "./config";

export class MigrationRunner {

    conn: any;

    async init(){
        console.log('RUNNING DATABASE MIGRATIONS');
        this.conn = await Database.connect();
        await Database.query(this.conn, `create table if not exists stak_migrations (
            id int not null,
            app varchar(100) not null,
            created datetime not null default current_timestamp,
            statement text not null
            );`);
    }

    async run(id: number, sql: string[]){
        let appliedMigrations = await Database.query(this.conn, `select * from stak_migrations where app=:app`, {app: Config.instance.app});
        if (appliedMigrations.find((m:any) => m.id === id)){
            console.log(id + ': already applied, skipping');
        }
        else {
            let t = this.conn.transaction();
            t.rollback((e:any,status:any) => {console.error(`Failed to apply migration ${id}: error ${e}, status ${status}`)})
            sql.forEach(s => {
                t.query(s)
            });    
            t.query(`insert into stak_migrations (id, statement, app) values (:id, :sql, :app)`, {id: id, sql: '', app: Config.instance.app})
            await t.commit();
            console.log(id + ': successfully applied');
        }
    }


}