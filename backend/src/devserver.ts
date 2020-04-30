import { configureApp } from "./api";

const app = configureApp();
let port = 3000;
app.listen(port, () => console.log(`Backend server running at http://localhost:${port}`))
