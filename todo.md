
ssh -T git@github.com
ssh: connect to host github.com port 22: No route to host


- rename req.user to req.jwtInfo or similar
- Run Config.ensureArgsSupplied before update-stack, perhaps as a separate "npm run check-args"
- Add login pages
- Parcel exclude the aws-sdk from lambda    
  - https://github.com/FlorianRappl/parcel-plugin-externals

- https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/
  - Not GA in CDK yet, see https://github.com/aws/aws-cdk/issues/5301
- You can get the 'FunctionName' output and then 'sam logs -tn <FunctionName>'


Keep the faith on the custom auth
    https://github.com/aws-amplify/amplify-js/issues/3436
        "All cognito session tokens id, access and refresh tokens are being persisted into localstorage. This goes against all industry security best practice of storing sensitive infomation in signed httponly cookies."