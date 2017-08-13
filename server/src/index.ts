import { Application, Request, Response } from 'express-serve-static-core';

import Constants from './common/Constants';
import ContainerController from './controllers/ContainerController';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app: Application = express();

if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next): void => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    });
}

app.use(bodyParser.json());
app.use(express.static(Constants.PUBLIC_DIR));

new ContainerController(app);

app.get('*', (request: Request, response: Response) =>
    response.sendFile(path.resolve(Constants.PUBLIC_DIR, 'index.html')));

app.listen(Constants.SERVER_PORT);
