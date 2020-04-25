import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import cognito = require('@aws-cdk/aws-cognito');
import * as S3 from '@aws-cdk/aws-s3';
import * as IAM from '@aws-cdk/aws-iam';
import { CloudFrontWebDistribution, OriginAccessIdentity } from '@aws-cdk/aws-cloudfront';
import { Config } from './util/config';
import { VerificationEmailStyle } from '@aws-cdk/aws-cognito';

export class ServerlessWikiStack extends cdk.Stack {

    bucket: S3.Bucket;
    distribution: CloudFrontWebDistribution;
    endpoint: apigw.LambdaRestApi;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        Config.ensureArgsSupplied();
        console.log(Config.appEnv())
        this.backend();
        this.frontend();
    }

    frontend() {
        this.bucket = new S3.Bucket(this, Config.appEnv() + '-hosting-bucket', {
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        let oai = new OriginAccessIdentity(this, Config.appEnv() + '-oai');
        this.distribution = new CloudFrontWebDistribution(this, Config.appEnv() + '-distribution', {
            originConfigs: [{
                s3OriginSource: {
                    s3BucketSource: this.bucket,
                    originAccessIdentity: oai,
                },
                behaviors: [{ isDefaultBehavior: true }],
            }]
        });
        this.bucket.addToResourcePolicy(new IAM.PolicyStatement({
            effect: IAM.Effect.ALLOW,
            resources: [
                this.bucket.bucketArn,
                this.bucket.bucketArn + '/*'
            ],
            actions: [
                's3:GetBucket*',
                's3:GetObject*',
                's3:List*',
            ],
            principals: [
                new IAM.CanonicalUserPrincipal(oai.cloudFrontOriginAccessIdentityS3CanonicalUserId)
            ]
        }));
        new cdk.CfnOutput(this, 'DistributionUri', { value: 'https://' + this.distribution.domainName })
        new cdk.CfnOutput(this, 'DistributionId', { value: this.distribution.distributionId })
        new cdk.CfnOutput(this, 'HostingBucket', { value: 's3://' + this.bucket.bucketName })
    }

    backend() {
        let table = new dynamodb.Table(this, Config.appEnv() + '-pages', {
            partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING }
        });
        let apiFunction = new lambda.Function(this, Config.appEnv() + '-api', {
            functionName: Config.appEnv() + '-api',
            code: lambda.Code.asset('../backend/api'),
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'handler.handler',
            environment: {
                TABLE_NAME: table.tableName
            }
        });
        table.grantReadWriteData(apiFunction);
        this.endpoint = new apigw.LambdaRestApi(this, Config.appEnv() + '-endpoint', {
            handler: apiFunction
        })

        let userPool = new cognito.UserPool(this, Config.appEnv() + '-user-pool', {
            selfSignUpEnabled: true,
            userVerification: {
                emailSubject: 'Verify your email for our awesome app!',
                emailBody: 'Hello {username}, Thanks for signing up to our awesome app! Your verification code is {####}',
                emailStyle: VerificationEmailStyle.CODE,
                smsMessage: 'Hello {username}, Thanks for signing up to our awesome app! Your verification code is {####}',
            }
        });

        let userPoolClient = new cognito.UserPoolClient(this, Config.appEnv() + 'user-pool-client', {
            userPoolClientName: Config.appEnv() + 'user-pool-client',
            authFlows: {
                adminUserPassword: true,
                refreshToken: true
            },
            generateSecret: false,
            userPool: userPool
        })

        new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
        new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
        new cdk.CfnOutput(this, 'FunctionName', { value: apiFunction.functionName });
        new cdk.CfnOutput(this, 'EndpointUrl', { value: this.endpoint.url });
    }

}


const app = new cdk.App();
new ServerlessWikiStack(app, Config.appEnv());
