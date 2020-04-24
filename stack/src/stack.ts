import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import * as S3 from '@aws-cdk/aws-s3';
import * as IAM from '@aws-cdk/aws-iam';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution, OriginAccessIdentity } from '@aws-cdk/aws-cloudfront';
import { writeFileSync } from 'fs';
import { execute } from './execute';

let PROJECT = 'sunwiki';
let ENVIRONMENT = 'alpha';
let QUALIFIED_NAME = `${PROJECT}-${ENVIRONMENT}`;
let BUCKET_NAME = `${QUALIFIED_NAME}-hosting-bucket`;

export class ServerlessWikiStack extends cdk.Stack {

    bucket: S3.Bucket;
    distribution: CloudFrontWebDistribution;
    endpoint: apigw.LambdaRestApi;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.backend();
        this.frontend();
        // this.publish();
    }

    publish() {
        // let frontendDir = '../frontend/dist';
        // let frontendConfig = {
        //     api: this.endpoint.url
        // }
        // writeFileSync(frontendDir + '/config.json', JSON.stringify(frontendConfig));
        // new s3deploy.BucketDeployment(this, 'BucketDeployment', {
        //     sources: [s3deploy.Source.asset('../frontend/dist')],
        //     destinationBucket: this.bucket,
        //     distribution: this.distribution,
        //     distributionPaths: ['/*'],
        // });
    }

    frontend() {
        this.bucket = new S3.Bucket(this, BUCKET_NAME, {
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        let oai = new OriginAccessIdentity(this, QUALIFIED_NAME + '-oai');
        this.distribution = new CloudFrontWebDistribution(this, QUALIFIED_NAME + '-distribution', {
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
        let table = new dynamodb.Table(this, QUALIFIED_NAME + '-pages', {
            partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING }
        });
        let apiFunction = new lambda.Function(this, QUALIFIED_NAME + '-api', {
            functionName: QUALIFIED_NAME + '-api',
            code: lambda.Code.asset('../backend/api'),
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'handler.handler',
            environment: {
                TABLE_NAME: table.tableName
            }
        });
        table.grantReadWriteData(apiFunction);
        this.endpoint = new apigw.LambdaRestApi(this, QUALIFIED_NAME + '-endpoint', {
            handler: apiFunction
        })
        new cdk.CfnOutput(this, 'FunctionName', { value: apiFunction.functionName })
        new cdk.CfnOutput(this, 'EndpointUrl', { value: this.endpoint.url })
    }

}


const app = new cdk.App();
new ServerlessWikiStack(app, QUALIFIED_NAME);
