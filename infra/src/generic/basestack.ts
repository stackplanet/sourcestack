import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import cognito = require('@aws-cdk/aws-cognito');
import * as S3 from '@aws-cdk/aws-s3';
import * as IAM from '@aws-cdk/aws-iam';
import * as route53 from '@aws-cdk/aws-route53';
import { CloudFrontWebDistribution, OriginAccessIdentity, CloudFrontAllowedMethods, SSLMethod, CloudFrontWebDistributionProps } from '@aws-cdk/aws-cloudfront';
import { VerificationEmailStyle, OAuthScope, CfnUserPool } from '@aws-cdk/aws-cognito';
import { StackOutput } from './stackoutput';
import { Duration } from '@aws-cdk/core';
import { Config } from '../../../scripts/config';

export class BaseStack extends cdk.Stack {

    bucket: S3.Bucket;
    distribution: CloudFrontWebDistribution;
    endpoint: apigw.LambdaRestApi;
    userPool: cognito.UserPool;
    userPoolClient: cognito.UserPoolClient;
    apiFunction: lambda.Function;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.cognito();
        this.backend();
        this.frontend();
        this.outputs();
    }
    
    frontend() {
        this.bucket = new S3.Bucket(this, Config.instance.appEnv + '-hosting-bucket', {
            bucketName: Config.instance.appEnv + '-hosting-bucket',
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        let oai = new OriginAccessIdentity(this, Config.instance.appEnv + '-oai');
        let distributionProps: CloudFrontWebDistributionProps = {
            comment: Config.instance.appEnv + ' distribution',
            aliasConfiguration: Config.instance.domain ? {
                names: [Config.instance.subdomain],
                acmCertRef: Config.instance.certificateArn,
                sslMethod: SSLMethod.SNI
            } : undefined,
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
                    allowedMethods: CloudFrontAllowedMethods.ALL,
                    defaultTtl: Duration.millis(0),
                    maxTtl: Duration.millis(0),
                    minTtl: Duration.millis(0),
                    forwardedValues: {
                        queryString: true,
                        cookies: {
                            forward: 'all'
                        },
                        // This doesn't work - bug in CDK?
                        // headers: ['*'],
                    }
                }]
            }]
        }
        this.distribution = new CloudFrontWebDistribution(this, Config.instance.appEnv + '-distribution', distributionProps);
        if (Config.instance.domain){
            new route53.CfnRecordSet(this, Config.instance.appEnv + '-recordset', {
                hostedZoneName: Config.instance.domain + '.',
                name: Config.instance.subdomain,
                type: 'A',
                aliasTarget: {
                    hostedZoneId: 'Z2FDTNDATAQYW2', // cloudfront.net
                    dnsName: this.distribution.domainName
                }
            })
        }
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
        this.apiFunction = new lambda.Function(this, Config.instance.appEnv + '-api', {
            functionName: Config.instance.appEnv + '-api',
            code: lambda.Code.asset('../api/dist'),
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'generic/handler.handler',
            environment: {
            }
        });
        this.apiFunction.addToRolePolicy(new IAM.PolicyStatement({
            actions: ['cognito-idp:*'],
            resources: [this.userPool.userPoolArn]
        }));
        this.endpoint = new apigw.LambdaRestApi(this, Config.instance.appEnv + '-endpoint', {
            restApiName: Config.instance.appEnv + '-endpoint',
            handler: this.apiFunction,
            proxy: true
        })
    }


    cognito(){
        this.userPool = new cognito.UserPool(this, Config.instance.appEnv + '-user-pool', {
            userPoolName: Config.instance.appEnv + '-userpool',
            selfSignUpEnabled: true,
            signInAliases: {
                email: true
            },
            autoVerify: {
                email: true
            },
            userVerification: {
                emailSubject: 'Verify your email for ' + Config.instance.app,
                emailBody: `Your verification code is: <h1>{####}</h1>`,
                emailStyle: VerificationEmailStyle.CODE,
            },
            passwordPolicy: {
                minLength: 8,
                requireDigits: true,
                requireLowercase: true,
                requireUppercase: true,
                requireSymbols: false
            },

        });
        if (Config.instance.cognitoEmailArn){
            const cfnUserPool = this.userPool.node.defaultChild as CfnUserPool;
            cfnUserPool.emailConfiguration = {
                emailSendingAccount: 'DEVELOPER',
                replyToEmailAddress: 'noreply@' + Config.instance.domain,
                from: 'noreply@' + Config.instance.domain,
                sourceArn: Config.instance.cognitoEmailArn
            };
        }
        this.userPoolClient = new cognito.UserPoolClient(this, Config.instance.appEnv + 'user-pool-client', {
            userPoolClientName: Config.instance.appEnv + 'user-pool-client',
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
                scopes: [OAuthScope.OPENID, OAuthScope.COGNITO_ADMIN]
            }
        })

        const cfnUserPoolClient = this.userPoolClient.node.defaultChild as cognito.CfnUserPoolClient;
        cfnUserPoolClient.supportedIdentityProviders = ['COGNITO'];

        new cognito.UserPoolDomain(this, Config.instance.appEnv + '-user-pool-domain', {
            userPool: this.userPool,
            cognitoDomain: {
                domainPrefix: Config.instance.appEnv

            }
        });
    }

    outputs() {
        let outputs: StackOutput = {
            DistributionUri: 'https://' + this.distribution.domainName,
            DistributionId: this.distribution.distributionId,
            HostingBucket: 's3://' + this.bucket.bucketName,
            UserPoolId: this.userPool.userPoolId,
            UserPoolClientId: this.userPoolClient.userPoolClientId,
            FunctionName: this.apiFunction.functionName,
            EndpointUrl: this.endpoint.url,
        }
        Object.keys(outputs).forEach((k) => new cdk.CfnOutput(this, k, {value: outputs[k as keyof StackOutput]}));
    }

}

const app = new cdk.App();
new BaseStack(app, Config.instance.appEnv);
