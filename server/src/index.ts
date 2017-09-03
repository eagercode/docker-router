import { Application, Request, Response } from 'express-serve-static-core';

import Constants from './common/Constants';
import ContainerController from './controllers/ContainerController';
import InitializationService from './services/InitializationService';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');

const app: Application = express();

app.listen(Constants.PROD_SERVER_PORT);

if (process.env.NODE_ENV === 'development') {
    app.listen(Constants.DEV_SERVER_PORT);
    app.use((req, res, next): void => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    });
}

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true,
        }),
        new winston.transports.File({
            name: 'access-file',
            filename: 'access-error.log',
            level: 'info',
        }),
    ],
    meta: true,
    msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
    expressFormat: true,
    colorize: true,
}));

app.use(bodyParser.json());
app.use(express.static(Constants.PUBLIC_DIR));

new ContainerController(app);

app.get('*', (request: Request, response: Response) =>
    response.sendFile(path.resolve(Constants.PUBLIC_DIR, 'index.html')));

new InitializationService().init();
