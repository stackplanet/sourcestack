import express from 'express';
import { json } from 'body-parser';
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');

import { AuthHandler } from './authhandler';
import { BackendConfig } from './backendconfig';
import { DataApi } from './dataapi';

export function configureApp() {
    const app = express();
    app.use(json());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    BackendConfig.init();
    AuthHandler.init(BackendConfig.instance, app);
    DataApi.init();

    app.get('/api/ping', async (req, res) => {
        console.log('ping')
        res.send('pongo');
    });

    app.get('/api/private/ping', async (req, res) => {
        res.send('pong');
    })

    app.get('/api/todos', async (req, res) => {
        await DataApi.query(res, 'select * from todos order by created desc');
    });

    app.post('/api/todo', async (req, res) => {
        await DataApi.query(res, `insert into todos (userid, value, status) 
            values (:userid, :value, :status)`, req.body);
    });

    app.delete('/api/todo', async (req, res) => {
        console.log('Deleting ' + req.query.id)
        await DataApi.query(res, `delete from todos where id=(:id)`, {id: req.query.id});
    });

    return app;
}
