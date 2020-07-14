# sourcestack: a highly adaptable template for full-stack serverless Typescript web apps

sourcestack is a "batteries included" full-stack serverless Typescript web app template, ready to be deployed into your AWS account and adapted to your needs. 

**sourcestack surfaces all infrastructure as source code**, in contrast to frameworks such as AWS Amplify that push infrastructure down into libraries and code generation tools. This gives you total control over your application and ensures that you won't be trapped by the assumptions made by a framework. See [Design philosophy](https://github.com/stackplanet/sourcestack/wiki/Design-philosophy) for more on this approach.

## Demo app

The template is based on a simple todo list app - you can try it out at [sourcestack-demo.com](https://sourcestack-demo.com)

## Main features

- A slick development experience with fast builds and deployments.
- Run and debug all of your application code locally with hot reloading.
- A curated set of tools and libraries that play nicely together, saving you all that frustrating integration work.
- Designed to be forked, so you can use alternative UI frameworks, different infrastructure components, etc.
- Customisable login UI/API with signup, signin and forgot password workflows.
- Easy deployment to your custom domain, e.g. `myapp.com`, including sending signup/password reset emails from that domain.
- Easy management of multiple test environments, e.g. `dev.myapp.com`, `staging.myapp.com`
- Serverless infrastructure for seamless scalability, minimal operations overhead and low-cost test environments.
- A focus on simplicity throughout.

## Technology choices

This version of the template makes certain technology choices: 

|Aspect|Implementation|
|----|------------------------------------------|
| Architecture | Client-side rendering, REST API, Serverless, NoSQL |
| UI | Typescript, Mithril with JSX, TailwindCSS, Parcel ([code example](https://github.com/stackplanet/sourcestack/blob/master/ui/src/pages/userhomepage.tsx)) |
| API | Typescript, Express, Parcel ([code example](https://github.com/stackplanet/sourcestack/blob/master/api/src/api.ts))|
| Test tools | Jest, Supertest, Taiko |
| Infrastructure as code | Typescript, Amazon CDK ([code example](https://github.com/stackplanet/sourcestack/blob/master/infra/src/generic/basestack.ts))|
| Infrastructure | AWS, Route 53, Cloudfront, API Gateway, Lambda, Cognito, SES |
| Database | DynamoDB |

If you want to use something else, sourcestack is designed to be forked. [Ideas for forks](https://github.com/stackplanet/sourcestack/wiki/Fork-ideas)

Just [fork](https://github.com/stackplanet/sourcestack/wiki/Forking) this repository and create your own template or app. If you'd like to share it with others, please raise an issue and we'll link to it here.

## Architecture

![Architecture Diagram](architecture.png?raw=true)

See [Code notes](https://github.com/stackplanet/sourcestack/wiki/Code-notes) for more.

## Limitations

The project is at an early stage - we're looking for help and feedback. See [Roadmap](https://github.com/stackplanet/sourcestack/wiki/Roadmap)

## Get started: Configure environment

Run the following command to allow the AWS Node.js SDK to [read config files](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-configured-credential-process.html):

- `export AWS_SDK_LOAD_CONFIG=1`

You might want to put this command into your `bash_profile` file or similar, so that the environment is always correctly set up.

## Deploy the app to your AWS account

The instructions below assume that you have:

* An AWS account
* An up-to-date installation of Node.js and the AWS CLI
* Some experience with AWS
* A Mac OSX or Linux environment (Windows not currently supported)

> **WARNING - this will create resources in your AWS account.** Charges should be minimal for test workloads, but please be sure that you understand the pricing as per https://aws.amazon.com/pricing.

Run the following commands:

- `git clone https://github.com/stackplanet/sourcestack`
- `cd sourcestack`
- `npm install`
- `npm run deploy --env=dev # Create a test environment called 'dev' and build/deploy the application code to it`

> Each "environment" is a self-contained instance of your application and infrastructure, with its own CloudFormation stack (called `sourcestack-demo-dev` in this case). You might have different environments representing different test stages or feature branches, such as `dev`, `staging`, `big-ui-refactor`, `production`.

The `deploy` script will take a while to complete as CDK creates resources for the first time.

The script outputs `App running at https://xxxxxxx.cloudfront.net`. Later you can add your own domain name. 

## Get the app running locally

The following will get the UI and API code running locally, using DynamoDB tables and Cognito user pools in AWS (a fully local mode using DynamoDB local and stubbed Cognito is on the roadmap).

- `npm run use-backend --env=dev # Configure your local app to use the database and Cognito user pool in the 'dev' environment`
- `npm run start`

Once the app has started, go to https://localhost:1234

## Make a UI change

- Open `ui/src/pages/splashpage.tsx` and change the title text.
- You'll see the updated text at https://localhost:1234.
- Run `npm run deploy-ui --env=dev`
- You'll now see the updated text in the dev environment.

## Make an API change

- Open `api/src/api.ts` and change the text returned by the `/ping` endpoint.
- You'll see the updated text at https://localhost:1234/api/ping.
- Run `npm run deploy-api --env=dev`
- You'll now see the updated text in the dev environment.

## Make an infrastructure change

- Open `infra/src/stack.ts`, find the `cognito()` function and change the text for `emailSubject`
- Run `npm run deploy-infra --env=dev`
- The new text will now be used in emails for user signup, forgot password etc in the dev environment.

> Note that `npm run deploy` can be used to build and deploy the complete app (ui, api and infratructure). The `deploy-ui`, `deploy-api` and `deploy-infra` commands provide a faster route to deploy if only a part of the application has changed.

## Debug the API locally

Here's how to do this in VS Code:

- Stop the `npm run start` process you started earlier (Ctrl-C)
- In VS Code, run `Debug: Toggle Auto Attach` and ensure that *Auto Attach: On* appears in the status bar.
- In the VS Code Terminal view, cd to the `sourcestack` directory and run `npm run debug`
- Open `api/src/api.ts` and put a breakpoint in the `/ping` endpoint.
- Go to https://localhost:1234/api/ping, and the VS Code debugger should open at the breakpoint.

## View API logs on AWS

- [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
- Run `npm run logs --env=dev`
- You will now see a live view (with a few seconds delay) of any logs written by your API function.

## Change the application name

- Edit `app.json` and change `name` to the application name that you want, e.g.

        {
            ...
            "name" : "myapp"
            ... 
        }

## Create a new environment

- The set of allowed environments is configured in `app.json`:

        {
            ...
            "environments" : ["dev","staging","production"]
            ... 
        }

- This prevents typos from creating new environments, e.g. `npm run deploy --env=aphla` would result in an error.
- To create a new environment, ensure that your environment name is in the list in `app.json` and then run `npm run deploy --env=<myenvironment>`

## Destroy an environment

- Run `npm run destroy-env --env=dev`. 
- After you confirm, the environment (and all its data!) will be completely deleted.

## Add a custom domain name 

- See [Use a custom domain](./readme-domain.md)

## Use SNS for sending email

By default, your Cognito User Pool sends account verification and password reset emails directly. This has some limitations:

- Emails are sent from no-reply@verificationemail.com rather than your custom domain
- A maximum of 50 emails can be sent per day: https://docs.aws.amazon.com/cognito/latest/developerguide/limits.html

You can configure your User Pool to send emails from SES, meaning that emails will come from your domain with far higher daily sending limits. See [Use SNS for sending email](./readme-email.md)

## Further reading

- [Code notes](https://github.com/stackplanet/sourcestack/wiki/Code-notes) explains the structure and operation of the template code.
- [sourcestack vs AWS Amplify](https://github.com/stackplanet/sourcestack/wiki/sourcestack-vs-AWS-Amplify)
- [Roadmap](https://github.com/stackplanet/sourcestack/wiki/Roadmap)
- [Troubleshooting](https://github.com/stackplanet/sourcestack/wiki/Troubleshooting)