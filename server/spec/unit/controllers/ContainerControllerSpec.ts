import Container from '../../../src/model/Container';
import ContainerController from '../../../src/controllers/ContainerController';
import ContainerService from '../../../src/services/ContainerService';
import { SinonStub } from 'sinon';

const sinon = require('sinon');

describe('ContainerController', () => {

    let controller: ContainerController;
    let containerService: ContainerService;

    beforeEach(() => {
        containerService = new ContainerService();
        controller = new ContainerController(null, containerService);
    });

    describe('getAll', () => {
        it('returns list of containers', (done) => {
            const expectedResult: Container[] = [
                new Container('e7b316865c96', '0cde913b8078', '"npm run start-dev"', '4 days ago', 'Exited (127) 4 days ago', '', 'zen_spence', false, '127.0.0.1', 'http://test.env.eu'),
                new Container('10554ce91a88', 'dockerrouter_web', '"npm run start-dev"', '28 hours ago', 'Up 11 minutes', '0.0.0.0:8000->8000/tcp', 'dockerrouter_web_1', true),
            ];
            sinon.stub(containerService, 'getAll').returns(Promise.resolve(expectedResult));

            const send = (containers: Container[]) => {
                expect(containers).toEqual(expectedResult);
                done();
            };
            const response: any = { send };

            controller.getAll(null, response);
        });

        it('returns system error', (done) => {
            const error: string = 'System error';
            sinon.stub(containerService, 'getAll').returns(Promise.reject(error));

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

    describe('update', () => {

        it('container should be updated', (done: DoneFn) => {
            const container: Container = new Container('e7b316865c96', '0cde913b8078', '"npm run start-dev"', '4 days ago', 'Exited (127) 4 days ago', '', 'zen_spence', false, '127.0.0.1', 'http://test.env.eu');
            const body: string = JSON.stringify(container);
            const request: any = { body };
            const stub: SinonStub = sinon.stub(containerService, 'update');
            stub.returns(Promise.resolve(true));

            const sendStatus = (code: number) => {
                expect(code).toBe(200);
                done();
            };
            const response: any = { sendStatus };

            controller.update(request, response);
        });

        it('should return error code if update fails', (done: DoneFn) => {
            const container: Container = new Container('e7b316865c96', '0cde913b8078', '"npm run start-dev"', '4 days ago', 'Exited (127) 4 days ago', '', 'zen_spence', false, '127.0.0.1', 'http://test.env.eu');
            const body: string = JSON.stringify(container);
            const request: any = { body };
            const stub: SinonStub = sinon.stub(containerService, 'update');
            stub.returns(Promise.resolve(false));

            const sendStatus = (code: number) => {
                expect(code).toBe(400);
                done();
            };
            const response: any = { sendStatus };

            controller.update(request, response);
        });
    });
});
