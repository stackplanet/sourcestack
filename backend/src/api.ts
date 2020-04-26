import express from 'express';
import { json } from 'body-parser';
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');

import { AuthHandler } from './authhandler';
import { BackendConfig } from './backendconfig';

export function configureApp() {
    const app = express();
    app.use(json());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    BackendConfig.init();
    AuthHandler.init(BackendConfig.instance, app);

    app.get('/api/ping', async (req, res) => {
        res.send('pong');
    });

    app.get('/api/private/ping', async (req, res) => {
        res.send('pong');
    })

    return app;
}
