import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');

export class ServerlessWikiStack extends cdk.Stack {

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const table = new dynamodb.Table(this, 'Hits', {
            partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING }
        });

        let apiFunction = new lambda.Function(this, 'HelloHandler', {
            code: lambda.Code.asset('backend/api'),
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'handler.handler',
            environment: {
                TABLE_NAME: table.tableName
            }
        });

        let endpoint = new apigw.LambdaRestApi(this, 'Endpoint', {
            handler: apiFunction
        })

    }
}

const app = new cdk.App();
new ServerlessWikiStack(app, 'CdkWorkshopStack');
