import { execute } from "./util/execute";
import { writeFileSync } from "fs";
import { Config } from "./util/config";

(async () => {
    Config.ensureArgsSupplied();
    let cdkOut = require(`../${Config.appEnv()}.out.json`);
    let config = cdkOut[Config.appEnv()];
    let functionName = config.FunctionName;

    // https://dev.to/terrierscript/build-aws-lambda-function-with-typescript-only-use-parcel-bundler-426a

    await execute(`aws lambda --region eu-west-1 update-function-code --function-name ${functionName} --zip-file fileb://../backend/dist.zip`);
    console.log('Published ' + functionName);
})();