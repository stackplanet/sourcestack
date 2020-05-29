import { Database } from "../database";

(async () => {
    let conn = await Database.connect();
    let res = await Database.query(conn, process.env.npm_config_query as string);
    console.log(res);
})();