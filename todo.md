
- roadmap    
- license, package.json blurb
- npm audit/fix
- code review

- Bug - no error when signing in as non-existent user in cloud
- Bug - sign up and get the "account with that email already exists" error. when going to other pages, the error persists
- Bug: enter incorrect change password confirm code, then the correct one. get "Missing required key 'Username' in params"
- Test on IE and other browsers
- wiki
- code notes
  - docs: tailwind vscode plugin

- npm run start: 
  - (node:10919) Warning: Accessing non-existent property 'INVALID_ALT_NUMB
  - Browserslist: caniuse-lite is outdated. Please run the following command: `npm update`


# After launch

- enable full email testing by creating a service, e.g. mailsink.net, that has an api to read back the email you sent
- e2e test that can be run by others
- cookie policy/privacy policy for staklist: https://gdpr.eu/privacy-notice/
- Roadmap 
  - Social login
- Legal stuff
- Fork ideas:
  - Aurora Serverless
  - React, possibly using Chakra UI (react components with atomic css https://news.ycombinator.com/item?id=23511811)
    - https://blog.logrocket.com/building-photo-gallery-app-from-scratch-chakra-ui/
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
- Can email be put into JWT?
- Test with expired refresh token: 


Malleable stack
    Can add extra infrastructure, e.g.
        - WAF
        - SNS
        - Use aurora instead of dynamodb

Future directions
    - Look at SSR app