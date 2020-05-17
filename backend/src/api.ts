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
        await DataApi.query(res, 'select * from todos');
   });

    return app;
}
