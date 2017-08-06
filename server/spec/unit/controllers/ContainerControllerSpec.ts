import Container from '../../../src/model/Container';
import ContainerBuilder from '../../builders/ContainerBuilder';
import ContainerController from '../../../src/controllers/ContainerController';
import DockerService from '../../../src/services/DockerService';

const sinon = require('sinon');

describe('ContainerController', () => {

    let controller: ContainerController;
    let dockerService: DockerService;

    beforeEach(() => {
        dockerService = new DockerService();
        controller = new ContainerController(null, dockerService);
    });

    describe('getAll', () => {
        it('returns list of containers', (done) => {
            const expectedResult: Container[] = [
                new ContainerBuilder().withTitle('First container').build(),
                new ContainerBuilder().withTitle('Second container').build(),
            ];
            sinon.stub(dockerService, 'ps').returns(Promise.resolve(expectedResult));

            const send = (containers: Container[]) => {
                expect(containers).toEqual(expectedResult);
                done();
            };
            const response: any = { send };

            controller.getAll(null, response);
        });
    });
});
