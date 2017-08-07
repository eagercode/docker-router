import { SinonStub } from 'sinon';

import CliService from '../../../src/services/CliService';
import Container from '../../../src/model/Container';
import DockerService from '../../../src/services/DockerService';

const sinon = require('sinon');

describe('DockerService', () => {

    let cliService: CliService;
    let service: DockerService;

    beforeEach(() => {
        cliService = new CliService();
        service = new DockerService(cliService);
    });

    describe('ps', () => {

        it('shell command `docker ps` should be executed', () => {
            const stub: SinonStub = sinon.stub(cliService, 'exec');
            const containersStr: string = [
                'CONTAINER ID        IMAGE               COMMAND               CREATED             STATUS                       PORTS                    NAMES',
                'e7b316865c96        0cde913b8078        "npm run start-dev"   4 days ago          Exited (127) 4 days ago                               zen_spence',
                '10554ce91a88        dockerrouter_web    "npm run start-dev"   28 hours ago        Up 11 minutes                0.0.0.0:8000->8000/tcp   dockerrouter_web_1',
                '',
            ].join('\n');
            const expectedResult: Container[] = [
                new Container('e7b316865c96', '0cde913b8078', '"npm run start-dev"', '4 days ago', 'Exited (127) 4 days ago', '', 'zen_spence', false),
                new Container('10554ce91a88', 'dockerrouter_web', '"npm run start-dev"', '28 hours ago', 'Up 11 minutes', '0.0.0.0:8000->8000/tcp', 'dockerrouter_web_1', true),
            ];
            stub.returns(Promise.resolve(containersStr));

            const result: Promise<Container[]> = service.ps();

            sinon.assert.calledWith(stub, 'docker ps');
            result.then((containers: Container[]): void => {
                expect(containers).toEqual(expectedResult);
            });
        });
    });
});
