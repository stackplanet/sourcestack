dynamodb
    Raise ticket for 
        res.send(result.records.map(t => {return {userId: t.userId, taskId: t.taskId, title: t.title}}));




- End to end testing


- add allowedEnvironments to app.json
- sns for sending forgot password emails
- Documentation
- cookie policy/privacy policy for staklist: https://gdpr.eu/privacy-notice/
- rename req.user to req.jwtInfo or similar
- Separate out "generic" things like migrationrunner, deplay-backend etc from bespoke things like stack.ts?
- change username to email and userId to email
- Add 'allowedEnvs' to app.json
- Use refresh token
- sensible stack traces/source maps for lambda?
- Ensure that dataapi only inits once in lambda
- consider refactoring the password/confirmPassword dialog into a component. The containing page will need to be able to see the status of the matching passwords/validation etc - how can that be done?
- Bug - no error when signing in as non-existent user in cloud
- Bug - sign up and get the "account with that email already exists" error. when going to other pages, the error persists
- Bug: enter incorrect change password confirm code, then the correct one. get "Missing required key 'Username' in params"
- Test on IE and other browsers




- 
# After launch

- make scripts cross-platform
- Move to HTTP API, see https://github.com/aws/aws-cdk/issues/5362
  - https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/
  - Not GA in CDK yet, see https://github.com/aws/aws-cdk/issues/5301
- Caching on Cloudfront for API Gateway - what is the best practice?
- Docs: You can get the 'FunctionName' output and then 'sam logs -tn <FunctionName>'
- git issues
    ssh -T git@github.com
    ssh: connect to host github.com port 22: No route to host

- document certificate thing: thisisunsafe
  - https://stackoverflow.com/questions/58802767/no-proceed-anyway-option-on-neterr-cert-invalid-in-chrome-on-macos
  - why does this not happen for RA webpack server?


- Warning if deploying a new environment

# Post launch

- 

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