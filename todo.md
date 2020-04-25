- Add Cognito user pool
- Add login pages
- Add api as origin to distribution

- https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/
  - Not GA in CDK yet, see https://github.com/aws/aws-cdk/issues/5301
- Parcel exclude the aws-sdk from lambda    
- Pass in ENVIRONMENT and PROJECT env vars
- You can get the 'FunctionName' output and then 'sam logs -tn <FunctionName>'