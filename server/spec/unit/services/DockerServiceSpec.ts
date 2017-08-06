import { SinonStub } from 'sinon';

import CliService from '../../../src/services/CliService';
import Container from '../../../src/model/Container';
import ContainerBuilder from '../../builders/ContainerBuilder';
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
            const mockResult: Promise<string> = new Promise<string>((resolve: (containers: string) => void): void => {
                resolve('First container\nSecond container');
            });
            const stub: SinonStub = sinon.stub(cliService, 'exec');
            stub.returns(mockResult);
            const expectedResult: Container[] = [
                new ContainerBuilder().withTitle('First container').build(),
                new ContainerBuilder().withTitle('Second container').build(),
            ];

            const result: Promise<Container[]> = service.ps();

            sinon.assert.calledWith(stub, 'docker ps');
            result.then((containers: Container[]): void => {
                expect(containers).toEqual(expectedResult);
            });
        });
    });
});
