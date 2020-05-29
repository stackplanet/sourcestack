import { Database } from "../database";
import { Config } from "../util/config";

(async () => {
    let conn = await Database.connect();
    console.log(`Kicking database in ${Config.env()}, please wait...`);
    await Database.query(conn, `select 1;`)
    console.log('Database is awake!');
})();

