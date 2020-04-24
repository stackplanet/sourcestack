import { execute } from "./execute";
import { writeFileSync } from "fs";

let cdkOut = require('../out.json');

let config = cdkOut['sunwiki-alpha'];

let hostingBucket = config.HostingBucket;
let distributionId = config.DistributionId;
let apiEndpoint = config.EndpointUrl;

let frontendConfig = {
    api: apiEndpoint
}
writeFileSync('../frontend/dist/config.json', JSON.stringify(frontendConfig));

execute(`aws s3 sync --delete ../frontend/dist ${hostingBucket}`).then(() => {
    execute(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*"`);
}).then(() => {
    console.log('Deployed!');
})