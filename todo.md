- Automated tests
  - puppeteer tests for sign up and sign in
  - Production deploys should go to the root domain
    
- npm run stack-outputs --key DistributionUri
- Add DistributionUri output to the end of deploy script
- Docs: You can get the 'FunctionName' output and then 'sam logs -tn <FunctionName>'
- Fix hardwired refs to eu-west-1
- Diagram
- End to end testing

- Forking https://help.github.com/en/github/getting-started-with-github/fork-a-repo


- document certificate thing: thisisunsafe
  - https://stackoverflow.com/questions/58802767/no-proceed-anyway-option-on-neterr-cert-invalid-in-chrome-on-macos
  - why does this not happen for RA webpack server?

- Do you need to generate server.cert etc? Try cloning a fresh copy of the repo and running.

- list-environments command
- Use config pattern for backend-config
- Documentation
- cookie policy/privacy policy for staklist: https://gdpr.eu/privacy-notice/
- rename req.user to req.jwtInfo or similar
- change username to email and userId to email
- Use refresh token
- Bug - no error when signing in as non-existent user in cloud
- Bug - sign up and get the "account with that email already exists" error. when going to other pages, the error persists
- Bug: enter incorrect change password confirm code, then the correct one. get "Missing required key 'Username' in params"
- Test on IE and other browsers

- 
# After launch

- consider refactoring the password/confirmPassword dialog into a component. The containing page will need to be able to see the status of the matching passwords/validation etc - how can that be done?
- sensible stack traces/source maps for lambda?
- Extract generic components and make it more of a reusable tool
- make scripts cross-platform (e.g. shelljs)
- Move to HTTP API, see https://github.com/aws/aws-cdk/issues/5362
  - https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/
  - Not GA in CDK yet, see https://github.com/aws/aws-cdk/issues/5301
- Caching on Cloudfront for API Gateway - what is the best practice?
- git issues
    ssh -T git@github.com
    ssh: connect to host github.com port 22: No route to host

- Fix email domain: noreply@staklist.net via amazonses.com 


- Could it be a code generator, e.g. stak create-app --ui=react --database=aurora-serverless

# Notes

1 ACU/h is $0.07 in London, so $52/m

Keep the faith on the custom auth
    https://github.com/aws-amplify/amplify-js/issues/3436
        "All cognito session tokens id, access and refresh tokens are being persisted into localstorage. This goes against all industry security best practice of storing sensitive infomation in signed httponly cookies."

    Lots and lots of noise about amplify using localstorage - keep on implementing this!

    Any use of the Amplify client-side auth will result in using localstorage



I like to understand what everything does and be able to change it

Malleable stack
    Can add extra infrastructure, e.g.
        - WAF
        - SNS
        - Use aurora instead of dynamodb
        - use HTTP api

Future directions
    - Look at SSR app