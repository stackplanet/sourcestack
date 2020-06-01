import { configureApp } from "./api";

const app = configureApp();
let port = 3000;
app.listen(port, () => console.log(`api running at http://localhost:${port}`))
