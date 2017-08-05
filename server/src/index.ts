import { Application, Request, Response } from 'express-serve-static-core';

import ContainerController from './controllers/ContainerController';
import Constants from './common/Constants';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app: Application = express();

app.use(bodyParser.json());
app.use(express.static(Constants.PUBLIC_DIR));

ContainerController.init(app);

app.get('*', (request: Request, response: Response) =>
    response.sendFile(path.resolve(Constants.PUBLIC_DIR, 'index.html')));

app.listen(Constants.SERVER_PORT);
