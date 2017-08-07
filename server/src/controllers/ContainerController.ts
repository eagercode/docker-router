import { Application, Request, Response } from 'express-serve-static-core';

import Constants from '../common/Constants';
import Container from '../model/Container';
import DockerService from '../services/DockerService';

export default class ContainerController {

    constructor(app: Application, private dockerService: DockerService = new DockerService()) {
        const urlPrefix: string = Constants.REST_API_URL_PREFIX + '/container';

        if (app) {
            app.get(urlPrefix + '/', this.getAll);
        }
    }

    getAll = (request: Request, response: Response): void => {
        this.dockerService.psAll()
            .then((containers: Container[]) => response.send(containers))
            .catch((error: string): void => {
                console.error(error);
                response.status(500).send({ error });
            });
    }
}
