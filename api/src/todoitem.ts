import { Decorator, Query, Table } from "dynamo-types";
import { BackendConfig } from './generic/backendconfig';

BackendConfig.init();

let tableName = BackendConfig.instance.app + '-' + BackendConfig.instance.env + '-todos';

@Decorator.Table({ name: tableName })
export class TodoItem extends Table {

    @Decorator.Attribute()
    public userId: string;

    @Decorator.Attribute()
    public taskId: number;

    @Decorator.Attribute()
    public title: string;

    @Decorator.FullPrimaryKey('userId', 'taskId')
    static readonly primaryKey: Query.FullPrimaryKey<TodoItem, string, number>;

    @Decorator.Writer()
    static readonly writer: Query.Writer<TodoItem>;
}