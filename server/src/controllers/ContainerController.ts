import { Application, Request, Response } from 'express-serve-static-core';

import Constants from '../common/Constants';
import Container from '../model/Container';
import ContainerService from '../services/ContainerService';

export default class ContainerController {

    constructor(app: Application,
                private containerService: ContainerService = new ContainerService()) {
        const urlPrefix: string = Constants.REST_API_URL_PREFIX + '/container';

        if (app) {
            app.get(urlPrefix + '/', this.getAll);
            app.post(urlPrefix + '/', this.update);
        }
    }

    getAll = (request: Request, response: Response): void => {
        this.containerService.getAll()
            .then((containers: Container[]) => response.send(containers))
            .catch((error: string): void => {
                console.error(error);
                response.status(500).send({ error });
            });
    }

    update = (request: Request, response: Response): void => {
        this.containerService.update(request.body)
            .then((result: boolean) => {
                if (result) {
                    response.sendStatus(200);
                } else {
                    console.error('Unable to process request: ' + request.body);
                    response.sendStatus(400);
                }
            })
            .catch((error: string): void => {
                console.error(error);
                response.status(500).send({ error });
            });
    }
}
