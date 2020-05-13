import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import cognito = require('@aws-cdk/aws-cognito');
import * as S3 from '@aws-cdk/aws-s3';
import * as IAM from '@aws-cdk/aws-iam';
import * as rds from '@aws-cdk/aws-rds';
import * as secretsManager from '@aws-cdk/aws-secretsmanager';
import { CloudFrontWebDistribution, OriginAccessIdentity, CloudFrontAllowedMethods } from '@aws-cdk/aws-cloudfront';
import { Config } from './util/config';
import { VerificationEmailStyle, OAuthScope } from '@aws-cdk/aws-cognito';
import { StackOutput } from './stackoutput';

export class ServerlessWikiStack extends cdk.Stack {

    bucket: S3.Bucket;
    distribution: CloudFrontWebDistribution;
    endpoint: apigw.LambdaRestApi;
    userPool: cognito.UserPool;
    userPoolClient: cognito.UserPoolClient;
    apiFunction: lambda.Function;
    databaseCredentialsSecret: secretsManager.Secret;
    rdsCluster: rds.CfnDBCluster;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        Config.ensureArgsSupplied();
        console.log(Config.appEnv())
        this.database();
        this.backend();
        this.cognito();
        this.frontend();
        this.outputs();
    }

    frontend() {
        this.bucket = new S3.Bucket(this, Config.appEnv() + '-hosting-bucket', {
            bucketName: Config.appEnv() + '-hosting-bucket',
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
            }, {
                customOriginSource: {
                    domainName: `${this.endpoint.restApiId}.execute-api.${this.region}.${this.urlSuffix}`
                },
                originPath: `/${this.endpoint.deploymentStage.stageName}`,
                behaviors: [{
                    pathPattern: '/api/*',
                    allowedMethods: CloudFrontAllowedMethods.ALL
                }]
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
            tableName: Config.appEnv() + '-pages',
            partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING }
        });
        this.apiFunction = new lambda.Function(this, Config.appEnv() + '-api', {
            functionName: Config.appEnv() + '-api',
            code: lambda.Code.asset('../backend/dist'),
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'handler.handler',
            environment: {
                TABLE_NAME: table.tableName,
                DB_SECRET_ARN: this.databaseCredentialsSecret.secretArn,
                DB_ARN: this.getDatabaseArn()
            }
        });
        table.grantReadWriteData(this.apiFunction);
        this.endpoint = new apigw.LambdaRestApi(this, Config.appEnv() + '-endpoint', {
            restApiName: Config.appEnv() + '-endpoint',
            handler: this.apiFunction
        })
        

    }

    getDatabaseArn(){
        return `arn:aws:rds:${this.region}:${this.account}:cluster:${this.rdsCluster.dbClusterIdentifier}`;
    }

    database(){
        const databaseUsername = 'movies-database';

        this.databaseCredentialsSecret = new secretsManager.Secret(this, 'DBCredentialsSecret', {
        secretName: `${Config.appEnv()}-credentials`,
        generateSecretString: {
            secretStringTemplate: JSON.stringify({
            username: databaseUsername,
            }),
            excludePunctuation: true,
            includeSpace: false,
            passwordLength: 32,
            excludeCharacters: '"@/\\',
            generateStringKey: 'password'
        }
        });

        const isDev = true;
        this.rdsCluster = new rds.CfnDBCluster(this, `${Config.appEnv()}-cluster`, {
            dbClusterIdentifier: `${Config.appEnv()}-cluster`,
            engineMode: 'serverless',
            engine: 'aurora',
            enableHttpEndpoint: true,
            databaseName: 'main',
            masterUsername: 'root',
            masterUserPassword: this.databaseCredentialsSecret.secretValueFromJson('password').toString(),
            backupRetentionPeriod: isDev ? 1 : 30,
            deletionProtection: !isDev,
            scalingConfiguration: {
                autoPause: true,
                maxCapacity: isDev ? 8 : 8,
                minCapacity: 1,
                secondsUntilAutoPause: isDev ? 3600 : 10800,
            }});

    }

    cognito(){
        this.userPool = new cognito.UserPool(this, Config.appEnv() + '-user-pool', {
            userPoolName: Config.appEnv() + '-userpool',
            selfSignUpEnabled: true,
            signInAliases: {
                email: true
            },
            autoVerify: {
                email: true
            },
            userVerification: {
                emailSubject: 'Verify your email for our awesome app!',
                emailBody: `Hello, thanks for signing up to our awesome app! Here is your code: '{####}'`,
                emailStyle: VerificationEmailStyle.CODE,
            }
        });

        this.userPoolClient = new cognito.UserPoolClient(this, Config.appEnv() + 'user-pool-client', {
            userPoolClientName: Config.appEnv() + 'user-pool-client',
            authFlows: {
                adminUserPassword: true,
                refreshToken: true
            },
            generateSecret: false,
            userPool: this.userPool,
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                    implicitCodeGrant: true
                },
                scopes: [OAuthScope.OPENID, OAuthScope.COGNITO_ADMIN],
                callbackUrls: ['https://localhost:1234']
            }
        })

        const cfnUserPoolClient = this.userPoolClient.node.defaultChild as cognito.CfnUserPoolClient;
        cfnUserPoolClient.supportedIdentityProviders = ['COGNITO'];

        new cognito.UserPoolDomain(this, Config.appEnv() + '-user-pool-domain', {
            userPool: this.userPool,
            cognitoDomain: {
                domainPrefix: Config.appEnv()

            }
        });
    }

    outputs() {
        new cdk.CfnOutput(this, StackOutput.DistributionUri, {value: 'https://' + this.distribution.domainName});
        new cdk.CfnOutput(this, StackOutput.DistributionId, {value: this.distribution.distributionId});
        new cdk.CfnOutput(this, StackOutput.HostingBucket, {value: 's3://' + this.bucket.bucketName});
        new cdk.CfnOutput(this, StackOutput.UserPoolId, {value: this.userPool.userPoolId});
        new cdk.CfnOutput(this, StackOutput.UserPoolClientId, {value: this.userPoolClient.userPoolClientId});
        new cdk.CfnOutput(this, StackOutput.FunctionName, {value: this.apiFunction.functionName});
        new cdk.CfnOutput(this, StackOutput.EndpointUrl, {value: this.endpoint.url});
        new cdk.CfnOutput(this, StackOutput.DatabaseArn, {value: this.getDatabaseArn()});

    }

}


const app = new cdk.App();
new ServerlessWikiStack(app, Config.appEnv());
