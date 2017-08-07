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
                new Container('e7b316865c96', '0cde913b8078', '"npm run start-dev"', '4 days ago', 'Exited (127) 4 days ago', '', 'zen_spence', false),
                new Container('10554ce91a88', 'dockerrouter_web', '"npm run start-dev"', '28 hours ago', 'Up 11 minutes', '0.0.0.0:8000->8000/tcp', 'dockerrouter_web_1', true),
            ];
            sinon.stub(dockerService, 'psAll').returns(Promise.resolve(expectedResult));

            const send = (containers: Container[]) => {
                expect(containers).toEqual(expectedResult);
                done();
            };
            const response: any = { send };

            controller.getAll(null, response);
        });

        it('returns system error', (done) => {
            const error: string = 'System error';
            sinon.stub(dockerService, 'psAll').returns(Promise.reject(error));

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
