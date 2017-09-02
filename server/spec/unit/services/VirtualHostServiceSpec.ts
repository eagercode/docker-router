import { SinonStub } from 'sinon';

import CliService from '../../../src/services/CliService';
import VirtualHost from '../../../src/model/VirtualHost';
import VirtualHostService from '../../../src/services/VirtualHostService';
import Constants from '../../../src/common/Constants';

const sinon = require('sinon');

describe('VirtualHostService', () => {

    let cliService: CliService;
    let service: VirtualHostService;

    beforeEach(() => {
        cliService = new CliService();
        service = new VirtualHostService([], cliService);
    });

    describe('addVirtualHost', () => {

        it('virtual host description should be appended to file', () => {
            const vHostDescription: string = 'Virtual Host Description';
            const descriptionStub: SinonStub = sinon.stub(service, 'getVirtualHostDescription');
            descriptionStub.returns(vHostDescription);
            const execStub: SinonStub = sinon.stub(cliService, 'exec');
            execStub.returns(Promise.resolve(true));
            const virtualHost: VirtualHost = new VirtualHost('e4ef2b5b9f98', '10.0.10.225', 'http://test-address.com');
            const expectedCommand: string = 'sed -i -- \'s@#v_hosts@#v_hosts\\n\\n' + vHostDescription + '@g\' ' + Constants.ROUTER_CONFIG_FILE;

            const result = service.addVirtualHost(virtualHost);

            expect(result).toEqual(Promise.resolve(true));
            sinon.assert.calledWith(execStub, expectedCommand);
        });

        it('virtual host must be defined', () => {
            sinon.stub(cliService, 'exec');
            let virtualHost: VirtualHost;

            let result = service.addVirtualHost(virtualHost);

            expect(result).toEqual(Promise.resolve(false));

            virtualHost = null;

            result = service.addVirtualHost(virtualHost);

            expect(result).toEqual(Promise.resolve(false));

            virtualHost = new VirtualHost('id');

            result = service.addVirtualHost(virtualHost);

            expect(result).toEqual(Promise.resolve(false));

            virtualHost.address = 'address';

            result = service.addVirtualHost(virtualHost);

            expect(result).toEqual(Promise.resolve(false));

            delete virtualHost.id;
            virtualHost.ip = 'ip';

            result = service.addVirtualHost(virtualHost);

            expect(result).toEqual(Promise.resolve(false));
        });
    });

    describe('getVirtualHostDescription', () => {

        it('virtual host description should be formatted', () => {
            const virtualHost: VirtualHost = new VirtualHost('e4ef2b5b9f98', '10.0.10.225', 'http://test-address.com');
            const expectedResult: string = '    #id=e4ef2b5b9f98\\n' +
                '    upstream localhost {\\n' +
                '        server 10.0.10.225;\\n' +
                '    }\\n' +
                '\\n' +
                '    server {\\n' +
                '        server_name test-address.com;\\n' +
                '\\n' +
                '        location / {\\n' +
                '            proxy_pass         http://test-address.com;\\n' +
                '            proxy_redirect     off;\\n' +
                '            proxy_set_header   Host $host;\\n' +
                '            proxy_set_header   X-Real-IP $remote_addr;\\n' +
                '            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;\\n' +
                '            proxy_set_header   X-Forwarded-Host $server_name;\\n' +
                '        }\\n' +
                '    }\\n' +
                '    #end';

            let result: string = service.getVirtualHostDescription(virtualHost);

            expect(result).toBe(expectedResult);

            virtualHost.address += '/';

            result = service.getVirtualHostDescription(virtualHost);

            expect(result).toBe(expectedResult);
        });

        it('virtual host or any field is undefined', () => {
            let virtualHost: VirtualHost;

            let result: string = service.getVirtualHostDescription(virtualHost);

            expect(result).toBe('');

            virtualHost = new VirtualHost();

            result = service.getVirtualHostDescription(virtualHost);

            expect(result).toBe('');

            virtualHost.address = 'http://test-address.com';

            result = service.getVirtualHostDescription(virtualHost);

            expect(result).toBe('');

            virtualHost.ip = '10.0.10.225';

            result = service.getVirtualHostDescription(virtualHost);

            expect(result).toBe('');

            delete virtualHost.address;

            result = service.getVirtualHostDescription(virtualHost);

            expect(result).toBe('');
        });
    });
});
