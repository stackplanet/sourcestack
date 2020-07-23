import { createApp } from "./main";

const app = createApp();
let port = 3000;
app.listen(port, () => console.log(`api running at http://localhost:${port}`))
