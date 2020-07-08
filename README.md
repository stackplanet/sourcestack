# sourcestack: a super flexible template for full-stack node web apps

**sourcestack** is a full-stack node web app template, ready to be deployed into your AWS account and adapted to your needs. 

The template includes a simple todo list app - you can try it out at [sourcestack-demo.com](https://sourcestack-demo.com)

sourcestack makes it easy to work with your application:

- A slick development experience with fast builds and deployments.
- Run and debug all of your application code locally, with hot reloading.
- A curated set of libraries and tools that all play nicely together, saving you all that frustrating integration work.
- Easy deployment to your custom domain, e.g. `myapp.com`, including sending signup/password reset emails from that domain.
- Easy management of multiple test environments, e.g. `dev.myapp.com`, `staging.myapp.com`
- Serverless infrastructure for seamless scalability, minimal operations overhead and low-cost test environments.

This version of the template makes certain technology choices: 

|Aspect|Implementation|
|----|------------------------------------------|
| Architecture | Client-side rendering, REST API, Serverless, NoSQL |
| UI | Typescript, Mithril with JSX (as a simpler alternative to React), TailwindCSS, Parcel |
| API | Typescript, Express, Parcel |
| Infrastructure as code | Typescript, Amazon CDK |
| Infrastructure | AWS, Route 53, Cloudfront, API Gateway, Lambda, Cognito, SES |
| Database | DynamoDB |

If you don't like these choices, sourcestack is designed to be forked! See [ideas for forks](https://github.com/stackfun/sourcestack/wiki/Fork-ideas).

Just [fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) this repository and create your own template or app. If you'd like to share it with others, please raise an issue and I'll link to it here.

## Design philosophy

sourcestack is designed to give you full control over all aspects of your application and infrastructure.

Frameworks like [AWS Amplify](https://aws.amazon.com/amplify) aim to simplify development by hiding the details of underlying infrastructure. This is great for getting started but can lead to problems when your requirements no longer match the framework's assumptions. Frameworks tend to be classic [leaky abstractions](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/).

sourcestack takes a **low abstraction** approach, surfacing all infrastructure as source code within the template instead of pushing it down into libraries and code generation tools. This gives the developer total control and encourages a deeper understanding of the technology stack. 

Because of this design, sourcestack is not a library that you include in your app. Instead you start by forking this repository and customising the code to fit your needs. Because the codebase is designed to be open and hackable, you can go in any direction you like - change the login mechanism, use alternative libraries, add new components, port to a different cloud... As bugfixes and improvements are made to the template you forked from, you can update your app as you choose using `git merge`.

## Limitations

- The project is at an early stage - I'm looking for help and feedback.
- Only tested on Max OSX Catalina so far. Linux should be OK but it's not tested yet. Let me know if you'd like Windows support. 

## Get started: Deploy the app to your AWS account

The instructions below assume that you have an AWS account and an up-to-date installation of nodejs.

> **WARNING - this will create resources in your AWS account.** Charges should be minimal for test workloads, but please be sure that you understand the pricing as per https://aws.amazon.com/pricing.

Run the following commands:

- `git clone https://github.com/stackfun/sourcestack`
- `cd sourcestack`
- `npm install`
- `npm run deploy --env=dev # Create a test environment called 'dev' and build/deploy the application code to it`

This will take a while to complete, as CDK creates resources including the Cloudformation distribution.

The script outputs `App running at https://xxxxxxx.cloudfront.net`. Later you can add your own domain name. 

## Get the app running locally

The following will get the UI and API code running locally, using DynamoDB tables and Cognito user pools in AWS (a fully local mode using DynamoDB local and stubbed Cognito is on the roadmap).

- `npm run use-backend --env=dev # Configure your local app to use the database and Cognito user pool in the dev environment`
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

# Generic vs app-specific code

The template includes "generic" code (code that would likely be the same across different applications) and app-specific code.

Generic code can be found in:

* `ui/src/generic` - login pages, sign up pages, forgot password pages etc.
* `scripts` - the scripts documented above, e.g. build, deploy etc.
* `api/src/generic` - authentication handler, backend configuration etc.
* `infra/src/generic` - the base stack defined in CDK. Note that the app-specific DynamoDB tables are defined in infra/src/stack.ts and this would be changed on a per-app basis.

Of course, you can still modify generic code if it doesn't suit your needs.