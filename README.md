# stak - an adaptable template for a full-stack serverless Typescript web app

**stak** is a fully featured serverless web app template, ready to be deployed into your AWS account and adapted to your needs. 

I created it as an alternative to AWS Amplify, which is a great framework but doesn't quite meet my requirements.

A running version of the example todo list app can be found at [staklist.net](https://staklist.net)

## Features

- Typescript everywhere - UI, API and infrastructure (using [AWS CDK](https://aws.amazon.com/cdk/)).
- Fast builds and fast incremental deployments.
- Run and debug all of your application code locally, with hot reloading.
- Adaptable login UI backed by Amazon Cognito.
- Simple database migration mechanism.

## Technology choices

Stak is really just a flexible template that you can use as a starting point for your web app. The example app uses certain technologies that I find pleasant to use, but you should be able to replace them without too much work:

- The front end uses [Mithril](https://mithril.js.org) and [Tailwind CSS](https://tailwindcss.com), but could be adapted to use React, Vue, Bootstrap, Bulma etc if you prefer.
- Express is used to provide a rest API, but you could replace this with GraphQL if that's your thing. TODO - what would you use?
- [Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/) is used as a relational data store, but you can use DynamoDB, FaunaDB or something else. 

## Limitations

- Early stage, looking for feedback/help
- Only tested on Max OSX Catalina so far. Linux should work but not tested yet. Let me know if you'd like Windows support. 
- Link to roadmap

## Deploy the app to your AWS account

> **WARNING - this will create resources including an Aurora Serverless database in your AWS account.** Charges should be minimal for test workloads, but please be sure that you understand the pricing of these resources as per https://aws.amazon.com/pricing.

Prerequisites:

- AWS account
- Node etc

Run the following commands:

- `git clone https://github.com/martinpllu/stak`
- `cd stak`
- `npm install`
- `npm run deploy --env=alpha # Create a test environment called 'alpha' and build/deploy the application code to it`

TODO - Is kick-database required here?

This will take a while to complete, as CDK creates resources including the database and Cloudformation distribution.

The script outputs `App running at https://xxxxxxx.cloudfront.net`. We'll learn later how to add your own domain name. 

## Get the app running locally

TODO - rename use-backend

- `npm run use-backend --env=alpha # Configure your local app to use the database and Cognito user pool in the alpha environment`
- `npm run start`

Once the app has started, go to https://localhost:1234

## Make a UI change

- Open `frontend/src/pages/splashpage.tsx` and change the title text.
- You'll see the updated text at https://localhost:1234.
- Run `npm run deploy-frontend --env=alpha`
- You'll now see the updated text in the alpha environment.

## Make an API change

- Open `backend/src/api.ts` and change the text returned by the `/ping` endpoint.
- You'll see the updated text at https://localhost:1234/api/ping.
- Run `npm run deploy-api --env=alpha`
- You'll now see the updated text in the alpha environment.

## Make an infrastructure change

- Open `infra/src/stack.ts`, find the `cognito()` function and change the text for `emailSubject`
- Run `npm run deploy-infra --env=alpha`
- The new text will now be used in emails for user signup, forgot password etc in the alpha environment.

> Note that `npm run deploy` can be used to build and deploy the complete app (ui, api and infratructure). The `deploy-ui`, `deploy-api` and `deploy-infra` commands provide a faster route to deploy if only a part of the application has changed.

## Run SQL against the database

- Run `npm run database-query --env=alpha --query="insert into todos (userid, value) values ('jimbob', 'Wash dishes')"`
- Run `npm run database-query --env=alpha --query="select * from todos"`

## Add a database migration

- Edit `infra/src/scripts/database-migrate.ts` and add a migration, e.g.
  
       await runner.run(2, `alter table todos add \`status\` varchar(20) default 'new'`);
       
- Run `npm run database-migrate --env=alpha` to run the migration. Note that migrations are also run as part of `npm run deploy`
- Run `npm run database-query --env=alpha --query="desc todos"` and you should see the new column listed.

## Debug the API locally

Here's how to do this in VS Code:

- Stop the `npm run start` process you started earlier (Ctrl-C)
- In VS Code, run `Debug: Toggle Auto Attach` and ensure that *Auto Attach: On* appears in the status bar.
- In the VS Code Terminal view, cd to the `stak` directory and run `npm run debug`
- Open `backend/src/api.ts` and put a breakpoint in the `/ping` endpoint.
- Go to https://localhost:1234/api/ping, and the VS Code debugger should open at the breakpoint.


## View logs



## Create a new environment

...

## 


# Docs TODO

- Authentication/security