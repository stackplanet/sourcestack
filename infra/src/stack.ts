import cdk = require('@aws-cdk/core');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import { BaseStack } from './generic/basestack';
import { Config } from '../../scripts/config';

export class Stack extends BaseStack {

    backend(){
        super.backend();
        let tableName = Config.instance.appEnv + '-todos';
        let table = new dynamodb.Table(this, tableName, {
            tableName: tableName,
            partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'taskId', type: dynamodb.AttributeType.NUMBER }
        });
        table.grantReadWriteData(this.apiFunction);
    }

}

const app = new cdk.App();
new Stack(app, Config.instance.appEnv);