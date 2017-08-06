import { Application, Request, Response } from 'express-serve-static-core';

import Constants from '../common/Constants';
import Container from '../model/Container';

export default class ContainerController {

    constructor(app: Application) {
        const urlPrefix: string = Constants.REST_API_URL_PREFIX + '/container';

        app.get(urlPrefix + '/', this.getAll);
    }

    getAll(request: Request, response: Response): void {
        const result: Container[] = [];
        result.push(new Container('Fiost'));
        result.push(new Container('Second'));

        response.send(result);
    }
}
