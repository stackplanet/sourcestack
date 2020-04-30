infra, frontend and backend


- running locally
    - Use get-stack-config in the publish scripts
      - convert to StackConfig class
        - getFromStack
        - createBackendConfig
    - Create a "use" script that populates the local config with a stack

- debugging locally

- Forgetting the = signs in "npm run update-stack --app=sunwiki --env=alpha" results in "true-true" being deployed!

- make scripts cross-platform
- add login pages
- git issues
    ssh -T git@github.com
    ssh: connect to host github.com port 22: No route to host
- Run Config.ensureArgsSupplied before update-stack, perhaps as a separate "npm run check-args"
  - consider moving env and app into config file?
- rename req.user to req.jwtInfo or similar
- Caching on Cloudfront for API Gateway - what is the best practice?
- Docs: You can get the 'FunctionName' output and then 'sam logs -tn <FunctionName>'

- document certificate thing: thisisunsafe
  - https://stackoverflow.com/questions/58802767/no-proceed-anyway-option-on-neterr-cert-invalid-in-chrome-on-macos

# Post launch

- https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/
  - Not GA in CDK yet, see https://github.com/aws/aws-cdk/issues/5301


# Notes

Keep the faith on the custom auth
    https://github.com/aws-amplify/amplify-js/issues/3436
        "All cognito session tokens id, access and refresh tokens are being persisted into localstorage. This goes against all industry security best practice of storing sensitive infomation in signed httponly cookies."

I like to understand what everything does and be able to change it

Malleable stack
    Can add extra infrastructure, e.g.
        - WAF
        - SNS
        - Use aurora instead of dynamodb
        - use HTTP api

Future directions
    - Look at SSR app