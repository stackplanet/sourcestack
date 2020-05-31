import express from 'express';
import { json } from 'body-parser';
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');

import { AuthHandler } from './authhandler';
import { BackendConfig } from './backendconfig';
import compression = require('compression');
import { Decorator, Query, Table } from "dynamo-types";

BackendConfig.init();
let tableName = BackendConfig.instance.app + '-' + BackendConfig.instance.env + '-todos';

@Decorator.Table({ name: tableName })
class TodoItem extends Table {

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

export function configureApp() {
    const app = express();
    app.use(json());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    AuthHandler.init(BackendConfig.instance, app);

    app.get('/api/ping', async (req, res) => {
        res.send('pong');
    });

    app.get('/api/private/ping', async (req, res) => {
        res.send('pong');
    })

    app.get('/api/todos', async (req, res) => {
        let result = await TodoItem.primaryKey.query({hash: req.user.userId as string});
        res.send(result.records.map(t => {return {userId: t.userId, taskId: t.taskId, title: t.title}}));
    });

    app.post('/api/todo', async (req, res) => {
        let todo = new TodoItem();
        todo.userId = req.user.userId as string;
        todo.taskId = new Date().getTime();
        todo.title = req.body.title;
        await todo.save();
        res.sendStatus(200);
    });

    app.delete('/api/todo', async (req, res) => {
        // TODO make taskId a url param
        await TodoItem.primaryKey.delete(req.user.userId as string, parseInt(req.query.id as string));
        res.sendStatus(200);
    });

    return app;
}
