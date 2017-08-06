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
                'CONTAINER ID IMAGE     COMMAND   CREATED   STATUS   PORTS    NAMES',
                'id_1         image_1   command_1 created_1 status_1 ports_1  longer_name_1',
                'id_2         image_2   command_2 created_2 status_2 ports_2  name_2',
                '',
            ].join('\n');
            stub.returns(Promise.resolve(containersStr));
            const expectedResult: Container[] = [
                new Container('id_1', 'image_1', 'command_1', 'created_1', 'status_1', 'ports_1', 'longer_name_1'),
                new Container('id_2', 'image_2', 'command_2', 'created_2', 'status_2', 'ports_2', 'name_2'),
            ];

            const result: Promise<Container[]> = service.ps();

            sinon.assert.calledWith(stub, 'docker ps');
            result.then((containers: Container[]): void => {
                expect(containers).toEqual(expectedResult);
            });
        });
    });
});
