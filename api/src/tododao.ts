import { Decorator, Query, Table } from "dynamo-types";
import { BackendConfig } from './generic/backendconfig';
import { Todo } from "./todo";

BackendConfig.init();

let tableName = BackendConfig.instance.app + '-' + BackendConfig.instance.env + '-todos';

@Decorator.Table({ name: tableName })
export class TodoDao extends Table implements Todo {

    @Decorator.Attribute()
    public userId: string;

    @Decorator.Attribute()
    public taskId: number;

    @Decorator.Attribute()
    public title: string;

    @Decorator.FullPrimaryKey('userId', 'taskId')
    static readonly primaryKey: Query.FullPrimaryKey<TodoDao, string, number>;

    @Decorator.Writer()
    static readonly writer: Query.Writer<TodoDao>;
}