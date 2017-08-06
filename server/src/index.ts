import { Application, Request, Response } from 'express-serve-static-core';

import Constants from './common/Constants';
import ContainerController from './controllers/ContainerController';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app: Application = express();

app.use(bodyParser.json());
app.use(express.static(Constants.PUBLIC_DIR));

new ContainerController(app);

app.get('*', (request: Request, response: Response) =>
    response.sendFile(path.resolve(Constants.PUBLIC_DIR, 'index.html')));

app.listen(Constants.SERVER_PORT);
