import cdk = require('@aws-cdk/core');
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront';
import * as Codebuild from '@aws-cdk/aws-codebuild';
import * as IAM from '@aws-cdk/aws-iam';
import * as S3 from '@aws-cdk/aws-s3';

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
        this.buildProject();
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
