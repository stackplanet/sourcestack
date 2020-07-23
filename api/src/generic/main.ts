import express from 'express';
import { json } from 'body-parser';
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import compression = require('compression');

import { AuthHandler } from './auth/authapi';
import { BackendConfig } from './backendconfig';
import { createTodoApi } from '../todoapi';

export function createApp() {
    const app = express();
    app.use(json());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: true }));
    BackendConfig.init();
    AuthHandler.init(BackendConfig.instance, app);
    createTodoApi(app);
    return app;
}
