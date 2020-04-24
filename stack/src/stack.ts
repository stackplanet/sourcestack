import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import * as S3 from '@aws-cdk/aws-s3';
import * as IAM from '@aws-cdk/aws-iam';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution, OriginAccessIdentity } from '@aws-cdk/aws-cloudfront';

let PROJECT = 'sunwiki';
let ENVIRONMENT = 'alpha';
let QUALIFIER = `${PROJECT}-${ENVIRONMENT}`;
let BUCKET_NAME = `${QUALIFIER}-hosting-bucket`;

export class ServerlessWikiStack extends cdk.Stack {

    bucket: S3.Bucket;
    distribution: CloudFrontWebDistribution;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.backend();
        this.frontend();
        this.publish();
    }

    publish() {
        new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [s3deploy.Source.asset('../frontend/dist')],
            destinationBucket: this.bucket,
            distribution: this.distribution,
            distributionPaths: ['/*'],
        });
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
            code: lambda.Code.asset('../backend/api'),
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

        new cdk.CfnOutput(this, 'FunctionName', { value: apiFunction.functionName })
    }

}


const app = new cdk.App();
new ServerlessWikiStack(app, QUALIFIER);
