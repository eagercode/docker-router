import { Application, Request, Response } from 'express-serve-static-core';

import Constants from '../common/Constants';
import Container from '../model/Container';

export default class ContainerController {

    static init(app: Application): void {
        const urlPrefix: string = Constants.REST_API_URL_PREFIX + '/container';

        app.get(urlPrefix + '/', this.getAll);
    }

    static getAll(request: Request, response: Response): void {
        const result: Container[] = [];
        result.push(new Container('Fiost'));
        result.push(new Container('Second'));

        response.send(result);
    }

}
