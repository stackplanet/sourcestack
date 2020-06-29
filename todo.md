- rename api/user to something else - in fact rename all auth endpoints
- rename req.user to req.jwtInfo or similar
- change username to email and userId to email
- Fix hardwired refs to eu-west-1

- roadmap    
- End to end testing

- document certificate thing: thisisunsafe
  - https://stackoverflow.com/questions/58802767/no-proceed-anyway-option-on-neterr-cert-invalid-in-chrome-on-macos
  - why does this not happen for RA webpack server?
  - Do you need to generate server.cert etc? Try cloning a fresh copy of the repo and running.

- cookie policy/privacy policy for staklist: https://gdpr.eu/privacy-notice/
- Bug - no error when signing in as non-existent user in cloud
- Bug - sign up and get the "account with that email already exists" error. when going to other pages, the error persists
- Bug: enter incorrect change password confirm code, then the correct one. get "Missing required key 'Username' in params"
- Test on IE and other browsers
- wiki
- docs: tailwind vscode plugin

- npm run start: 
  - (node:10919) Warning: Accessing non-existent property 'INVALID_ALT_NUMB
  - Browserslist: caniuse-lite is outdated. Please run the following command: `npm update`

- revisit cli - can this be made simple? 

# After launch

- Roadmap 
  - Social login
- Fork ideas:
  - Aurora Serverless
  - React, possibly using Chakra UI (react components with atomic css https://news.ycombinator.com/item?id=23511811)
  - SSR
- Document auth
- Move to HTTP API, see https://github.com/aws/aws-cdk/issues/5362
  - https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/
  - Not GA in CDK yet, see https://github.com/aws/aws-cdk/issues/5301
- Automated tests
  - puppeteer tests for sign up and sign in
  - Production deploys should go to the root domain
- Only run auth.integ.test as integ test
  - use https://www.npmjs.com/package/jest-runner-groups
- list-environments command
- code tour
- why do tsc compile errors not break the build?
- consider refactoring the password/confirmPassword dialog into a component. The containing page will need to be able to see the status of the matching passwords/validation etc - how can that be done?
- sensible stack traces/source maps for lambda?
- make scripts cross-platform (e.g. shelljs)
- Caching on Cloudfront for API Gateway - what is the best practice?

- Fix email domain: noreply@staklist.net via amazonses.com 
- Pipelines
- Test with expired refresh token: 


Malleable stack
    Can add extra infrastructure, e.g.
        - WAF
        - SNS
        - Use aurora instead of dynamodb

Future directions
    - Look at SSR app