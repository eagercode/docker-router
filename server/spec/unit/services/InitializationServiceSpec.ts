import InitializationService from '../../../src/services/InitializationService';
import { SinonStub } from 'sinon';
import Container from '../../../src/model/Container';
import VirtualHostService from '../../../src/services/VirtualHostService';
import DockerService from '../../../src/services/DockerService';
import Constants from '../../../src/common/Constants';
import VirtualHost from '../../../src/model/VirtualHost';

const sinon = require('sinon');

describe('InitializationService', () => {

    let dockerService: DockerService;
    let virtualHostService: VirtualHostService;
    let service: InitializationService;

    beforeEach(() => {
        dockerService = new DockerService();
        virtualHostService = new VirtualHostService();
        service = new InitializationService(dockerService, virtualHostService);
    });

    describe('init', () => {

        it('virtual host should be updated', (done: DoneFn) => {
            const containers: Container[] = [
                new Container('e7b316865c96', '0cde913b8078', '"npm run start-dev"', '4 days ago', 'Exited (127) 4 days ago', '', 'httpd', false),
                new Container('10554ce91a88', 'dockerrouter_web', '"npm run start-dev"', '28 hours ago', 'Exited (137) 2 months ago', '0.0.0.0:8000->8000/tcp', 'dockerrouter_web_1', false),
            ];
            const dockerStub: SinonStub = sinon.stub(dockerService, 'ps');
            dockerStub.returns(Promise.resolve(containers));
            const expectedResult: VirtualHost = new VirtualHost(containers[1].id, '192.168.11.127', Constants.WEB_CONTAINER_ADDRESS);
            sinon.stub(virtualHostService, 'update').returns(Promise.resolve(true));
            const ipStub: SinonStub = sinon.stub(service, 'getIpAddress');
            ipStub.returns(expectedResult.ip);

            const result = service.init();

            sinon.assert.called(dockerStub);
            result
                .then((result: boolean) => result ? done() : done.fail('Error'))
                .catch((err: string) => done.fail(err));
        });
    });
});
