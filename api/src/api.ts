import express from 'express';
import { json } from 'body-parser';
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import compression = require('compression');

import { AuthHandler } from './generic/authhandler';
import { BackendConfig } from './generic/backendconfig';
import { TodoItem } from './todoitem';

export function configureApp() {
    const app = express();
    app.use(json());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    BackendConfig.init();
    AuthHandler.init(BackendConfig.instance, app);

    app.get('/api/ping', async (req, res) => {
        res.send('pong');
    });

    app.get('/api/private/ping', async (req, res) => {
        res.send('pong ' + req.user.userId);
    });

    app.get('/api/private/todos', async (req, res) => {
        let result = await TodoItem.primaryKey.query({hash: req.user.userId as string});
        res.send(result.records.map(t => t.serialize()));
    });

    app.post('/api/private/todo', async (req, res) => {
        let todo = new TodoItem();
        todo.userId = req.user.userId as string;
        todo.taskId = new Date().getTime();
        todo.title = req.body.title;
        await todo.save();
        res.sendStatus(200);
    });

    app.delete('/api/private/todo', async (req, res) => {
        await TodoItem.primaryKey.delete(req.user.userId as string, parseInt(req.query.id as string));
        res.sendStatus(200);
    });

    return app;
}
