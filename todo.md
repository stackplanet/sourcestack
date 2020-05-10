- change username to email and userId to email

- End to end create todo        



- make scripts cross-platform
- add login pages
- git issues
    ssh -T git@github.com
    ssh: connect to host github.com port 22: No route to host
- rename req.user to req.jwtInfo or similar
- Caching on Cloudfront for API Gateway - what is the best practice?
- Docs: You can get the 'FunctionName' output and then 'sam logs -tn <FunctionName>'

- document certificate thing: thisisunsafe
  - https://stackoverflow.com/questions/58802767/no-proceed-anyway-option-on-neterr-cert-invalid-in-chrome-on-macos


- Warning if deploying a new environment

# Post launch

- https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/
  - Not GA in CDK yet, see https://github.com/aws/aws-cdk/issues/5301


# Notes

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