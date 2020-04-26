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
import {StackOutput} from './stackoutput';

export class ServerlessWikiStack extends cdk.Stack {

    bucket: S3.Bucket;
    distribution: CloudFrontWebDistribution;
    endpoint: apigw.LambdaRestApi;
    userPool: cognito.UserPool;
    userPoolClient: cognito.UserPoolClient;
    apiFunction: lambda.Function;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        Config.ensureArgsSupplied();
        console.log(Config.appEnv())
        this.backend();
        this.frontend();
        this.outputs();
    }

    outputs(){
        let output: StackOutput = {
            DistributionUri: 'https://' + this.distribution.domainName,
            DistributionId: this.distribution.distributionId,
            HostingBucket: 's3://' + this.bucket.bucketName,
            UserPoolId: this.userPool.userPoolId,
            UserPoolClientId: this.userPoolClient.userPoolClientId,
            FunctionName: this.apiFunction.functionName,
            EndpointUrl: this.endpoint.url,
        }
        Object.keys(output).forEach((key) => new cdk.CfnOutput(this, key, { value: output[key as keyof StackOutput]}));
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
        
    }

    backend() {
        let table = new dynamodb.Table(this, Config.appEnv() + '-pages', {
            partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING }
        });
        this.apiFunction = new lambda.Function(this, Config.appEnv() + '-api', {
            functionName: Config.appEnv() + '-api',
            code: lambda.Code.asset('../backend/'),
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'handler.handler',
            environment: {
                TABLE_NAME: table.tableName
            }
        });
        table.grantReadWriteData(this.apiFunction);
        this.endpoint = new apigw.LambdaRestApi(this, Config.appEnv() + '-endpoint', {
            handler: this.apiFunction
        })

        this.userPool = new cognito.UserPool(this, Config.appEnv() + '-user-pool', {
            selfSignUpEnabled: true,
            userVerification: {
                emailSubject: 'Verify your email for our awesome app!',
                emailBody: 'Hello {username}, Thanks for signing up to our awesome app! Your verification code is {####}',
                emailStyle: VerificationEmailStyle.CODE,
                smsMessage: 'Hello {username}, Thanks for signing up to our awesome app! Your verification code is {####}',
            }
        });

        this.userPoolClient = new cognito.UserPoolClient(this, Config.appEnv() + 'user-pool-client', {
            userPoolClientName: Config.appEnv() + 'user-pool-client',
            authFlows: {
                adminUserPassword: true,
                refreshToken: true
            },
            generateSecret: false,
            userPool: this.userPool
        })

        
    }

}


const app = new cdk.App();
new ServerlessWikiStack(app, Config.appEnv());
