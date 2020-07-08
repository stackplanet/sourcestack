import { fromStack } from "../../../infra/src/generic/stackoutput";
import { testApp } from "./integ-test-app";

(async () => {
    let stackConfig = await fromStack('sourcestack-demo-dev');
    console.log(stackConfig)
    testApp('https://localhost:1234', stackConfig.UserPoolId);
})();