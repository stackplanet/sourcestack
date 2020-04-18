import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import * as S3 from '@aws-cdk/aws-s3';
import * as IAM from '@aws-cdk/aws-iam';
import * as Codebuild from '@aws-cdk/aws-codebuild';
import { CloudFrontWebDistribution, OriginAccessIdentity } from '@aws-cdk/aws-cloudfront';

let PROJECT = 'sunwiki';
let ENVIRONMENT = 'alpha';
let QUALIFIER = `${PROJECT}-${ENVIRONMENT}`;
let BUCKET_NAME = `${QUALIFIER}-hosting-bucket`;
let BUILD_BRANCH = 'master';
let REPO_OWNER = 'jmpllu';
let REPO_NAME = 'sunwiki';

export class ServerlessWikiStack extends cdk.Stack {

    bucket: S3.Bucket;
    distribution: CloudFrontWebDistribution;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.backend();
        this.frontend();
        // this.buildProject();
    }

    frontend() {
        this.bucket = new S3.Bucket(this, BUCKET_NAME, {
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        const oai = new OriginAccessIdentity(this, QUALIFIER + '-oai');

        this.distribution = new CloudFrontWebDistribution(this, QUALIFIER + '-distribution',
            {
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: this.bucket,
                            originAccessIdentity: oai,
                        },
                        behaviors: [{ isDefaultBehavior: true }],
                    }
                ]
            }
        );


        // add IAM roles for Cloudfront only access to S3
        // const cloudfrontS3Access = new IAM.PolicyStatement();
        // cloudfrontS3Access.addActions('s3:GetBucket*');
        // cloudfrontS3Access.addActions('s3:GetObject*');
        // cloudfrontS3Access.addActions('s3:List*');
        // cloudfrontS3Access.addResources(this.bucket.bucketArn);
        // cloudfrontS3Access.addResources(`${this.bucket.bucketArn}/*`);
        // cloudfrontS3Access.addCanonicalUserPrincipal(
        //     cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
        // );

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
    }

    backend() {
        const table = new dynamodb.Table(this, QUALIFIER + '-pages', {
            partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING }
        });

        let apiFunction = new lambda.Function(this, QUALIFIER + '-api', {
            functionName: QUALIFIER + '-api',
            code: lambda.Code.asset('backend/api'),
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'handler.handler',
            environment: {
                TABLE_NAME: table.tableName
            }
        });

        table.grantReadWriteData(apiFunction);

        let endpoint = new apigw.LambdaRestApi(this, QUALIFIER + '-endpoint', {
            handler: apiFunction
        })
    }

    buildProject() {
        // codebuild project setup
        const webhooks: Codebuild.FilterGroup[] = [
            Codebuild.FilterGroup.inEventOf(
                Codebuild.EventAction.PUSH,
                Codebuild.EventAction.PULL_REQUEST_MERGED
            ).andHeadRefIs(BUILD_BRANCH),
        ];

        const repo = Codebuild.Source.gitHub({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            webhook: true,
            webhookFilters: webhooks,
            reportBuildStatus: true,
        });

        const project = new Codebuild.Project(this, QUALIFIER + '-build', {
            buildSpec: Codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
            projectName: QUALIFIER + '-build',
            environment: {
                buildImage: Codebuild.LinuxBuildImage.STANDARD_3_0,
                computeType: Codebuild.ComputeType.SMALL,
                environmentVariables: {
                    S3_BUCKET: {
                        value: this.bucket.bucketName,
                    },
                    CLOUDFRONT_DIST_ID: {
                        value: this.distribution.distributionId,
                    },
                },
            },
            source: repo,
            timeout: cdk.Duration.minutes(20),
        });

        project.addToRolePolicy(
            new IAM.PolicyStatement({
                effect: IAM.Effect.ALLOW,
                resources: [this.bucket.bucketArn, `${this.bucket.bucketArn}/*`],
                actions: [
                    's3:GetBucket*',
                    's3:List*',
                    's3:GetObject*',
                    's3:DeleteObject',
                    's3:PutObject',
                ],
            })
        );
        project.addToRolePolicy(
            new IAM.PolicyStatement({
                effect: IAM.Effect.ALLOW,
                resources: ['*'],
                actions: [
                    'cloudfront:CreateInvalidation',
                    'cloudfront:GetDistribution*',
                    'cloudfront:GetInvalidation',
                    'cloudfront:ListInvalidations',
                    'cloudfront:ListDistributions',
                ],
            })
        );
    }

}


const app = new cdk.App();
new ServerlessWikiStack(app, QUALIFIER);
