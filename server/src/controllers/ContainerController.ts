'use strict';

import {Application, Request, Response} from 'express-serve-static-core';

import {AbstractController} from './AbstractController';
import Constants from '../common/Constants';
import Container from '../model/Container';

export default class ContainerController extends AbstractController {

    constructor(app: Application) {
        super(app);
    }

    registerRoutes(app: Application): void {
        let urlPrefix: string = Constants.REST_API_URL_PREFIX + '/container';

        app.get(urlPrefix + '/', this.getAll);
    }

    getAll(request: Request, response: Response): void {
        let result: Container[] = [];
        result.push(new Container('Fiost'));
        result.push(new Container('Second'));

        response.send(result);
    }

}