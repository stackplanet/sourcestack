import { Database } from "./database";

(async () => {
    let conn = await Database.connect();
    await Database.query(conn, process.env.npm_config_query as string);
})();