import * as express from 'express';
import { json } from 'body-parser';
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');

import './config.json';
import { AuthHandler } from './authhandler';

export function configureApp() {
    const app = express();
    app.use(json());


    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    let config = {} // TODO - get config from env vars
    AuthHandler.init(config, app);

    app.get('/api/ping', async (req, res) => {
        res.send('pong');
    });

    app.get('/api/private/ping', async (req, res) => {
        res.send('pong');
    })

    return app;
}
