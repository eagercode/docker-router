import Container from '../../../src/model/Container';
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
                new Container('1', 'image_1', 'command_1', 'created_1', 'status_1', 'ports_1', 'n_1'),
                new Container('2', 'image_2', 'command_2', 'created_2', 'status_2', 'ports_2', 'container_name_2'),
            ];
            sinon.stub(dockerService, 'ps').returns(Promise.resolve(expectedResult));

            const send = (containers: Container[]) => {
                expect(containers).toEqual(expectedResult);
                done();
            };
            const response: any = { send };

            controller.getAll(null, response);
        });

        it('returns system error', (done) => {
            const error: string = 'System error';
            sinon.stub(dockerService, 'ps').returns(Promise.reject(error));

            const send = (err: {}) => {
                expect(err).toEqual({ error });
                done();
            };
            const status = (httpStatus: number) => {
                expect(httpStatus).toBe(500);
                return { send };
            };

            const response: any = { status };
            controller.getAll(null, response);
        });
    });
});
