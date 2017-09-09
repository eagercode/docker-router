import Container from '../../../src/model/Container';
import ContainerService from '../../../src/services/ContainerService';
import VirtualHost from '../../../src/model/VirtualHost';
import DockerService from '../../../src/services/DockerService';
import VirtualHostService from '../../../src/services/VirtualHostService';
import { SinonStub } from 'sinon';

const sinon = require('sinon');

describe('ContainerService', () => {

    let dockerService: DockerService;
    let virtualHostService: VirtualHostService;
    let service: ContainerService;

    beforeEach(() => {
        dockerService = new DockerService();
        virtualHostService = new VirtualHostService();
        service = new ContainerService(dockerService, virtualHostService);
    });

    describe('getAll', () => {

        it('it should return containers', (done: DoneFn) => {
            const containers: Container[] = [
                new Container('e7b316865c96', '0cde913b8078', '"npm run start-dev"', '4 days ago', 'Exited (127) 4 days ago', '', 'zen_spence', false),
                new Container('10554ce91a88', 'dockerrouter_web', '"npm run start-dev"', '28 hours ago', 'Exited (137) 2 months ago', '0.0.0.0:8000->8000/tcp', 'dockerrouter_web_1', false),
            ];
            const dockerStub: SinonStub = sinon.stub(dockerService, 'psAll');
            dockerStub.returns(Promise.resolve(containers));
            const vHosts: { [key: string]: VirtualHost } = {
                '0509b6c18de7': new VirtualHost('0509b6c18de7', '10.11.12.13', 'https://url.org'),
                '10554ce91a88': new VirtualHost('10554ce91a88', '127.0.0.1', 'http://test.env.eu'),
            };
            const vHostsStub: SinonStub = sinon.stub(virtualHostService, 'getAll');
            vHostsStub.returns(vHosts);
            const expectedResult: Container[] = [
                new Container('e7b316865c96', '0cde913b8078', '"npm run start-dev"', '4 days ago', 'Exited (127) 4 days ago', '', 'zen_spence', false),
                new Container('10554ce91a88', 'dockerrouter_web', '"npm run start-dev"', '28 hours ago', 'Exited (137) 2 months ago', '0.0.0.0:8000->8000/tcp', 'dockerrouter_web_1', false, '127.0.0.1', 'http://test.env.eu'),
            ];

            const result = service.getAll();

            sinon.assert.called(dockerStub);
            sinon.assert.called(vHostsStub);
            result
                .then((containers) => {
                    expect(containers).toEqual(expectedResult);
                    done();
                })
                .catch((err: string) => done.fail(err));
        });

        it('there are no containers', (done: DoneFn) => {
            const dockerStub: SinonStub = sinon.stub(dockerService, 'psAll');
            dockerStub.returns(Promise.reject('Error'));
            const vHosts: { [key: string]: VirtualHost } = {
                '0509b6c18de7': new VirtualHost('0509b6c18de7', '10.11.12.13', 'https://url.org'),
                '10554ce91a88': new VirtualHost('10554ce91a88', '127.0.0.1', 'http://test.env.eu'),
            };
            const vHostsStub: SinonStub = sinon.stub(virtualHostService, 'getAll');
            vHostsStub.returns(vHosts);

            const result = service.getAll();

            sinon.assert.called(dockerStub);
            sinon.assert.called(vHostsStub);
            result
                .then(() => fail('Error should be thrown'))
                .catch((err: string) => done());
        });

        it('there are no virtual hosts', (done: DoneFn) => {
            const containers: Container[] = [
                new Container('e7b316865c96', '0cde913b8078', '"npm run start-dev"', '4 days ago', 'Exited (127) 4 days ago', '', 'zen_spence', false),
                new Container('10554ce91a88', 'dockerrouter_web', '"npm run start-dev"', '28 hours ago', 'Exited (137) 2 months ago', '0.0.0.0:8000->8000/tcp', 'dockerrouter_web_1', false),
            ];
            const dockerStub: SinonStub = sinon.stub(dockerService, 'psAll');
            dockerStub.returns(Promise.resolve(containers));
            const vHostsStub: SinonStub = sinon.stub(virtualHostService, 'getAll');
            vHostsStub.rejects('Error');

            const result = service.getAll();

            sinon.assert.called(dockerStub);
            sinon.assert.called(vHostsStub);
            result
                .then(() => fail('Error should be thrown'))
                .catch((err: string) => done());
        });
    });

    describe('update', () => {

        it(`container's virtual host should be updated`, (done: DoneFn) => {
            const removeStub: SinonStub = sinon.stub(virtualHostService, 'remove');
            removeStub.returns(Promise.resolve(true));
            sinon.stub(virtualHostService, 'add').returns(Promise.resolve(true));
            const container: Container = new Container('10554ce91a88', 'dockerrouter_web', '"npm run start-dev"', '28 hours ago', 'Exited (137) 2 months ago', '0.0.0.0:8000->8000/tcp', 'dockerrouter_web_1', false, '127.0.0.1', 'http://test.env.eu');

            const result = service.update(container);

            sinon.assert.calledWith(removeStub, container.id);

            result
                .then((result: boolean) => result ? done() : done.fail('Error'))
                .catch((err: string) => done.fail(err));
        });

        it('container should be required', (done: DoneFn) => {
            const result = service.update(null);

            result
                .then(() => done.fail('Error'))
                .catch((err: string) => done());
        });

        it(`container's id should be required`, (done: DoneFn) => {
            const container: Container = new Container(null, 'dockerrouter_web', '"npm run start-dev"', '28 hours ago', 'Exited (137) 2 months ago', '0.0.0.0:8000->8000/tcp', 'dockerrouter_web_1', false, '127.0.0.1', 'http://test.env.eu');

            const result = service.update(container);

            result
                .then(() => done.fail('Error'))
                .catch((err: string) => done());
        });
    });
});
