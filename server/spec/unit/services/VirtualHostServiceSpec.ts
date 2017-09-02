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

    describe('add', () => {

        it('virtual host should be appended to file', () => {
            const vHostDescription: string = 'Virtual Host Description';
            const descriptionStub: SinonStub = sinon.stub(service, 'getDescription');
            descriptionStub.returns(vHostDescription);
            const execStub: SinonStub = sinon.stub(cliService, 'exec');
            execStub.returns(Promise.resolve(true));
            const virtualHost: VirtualHost = new VirtualHost('e4ef2b5b9f98', '10.0.10.225', 'http://test-address.com');
            const expectedCommand: string = 'sed -i -- \'s@#v_hosts@#v_hosts\\n\\n' + vHostDescription + '@g\' ' + Constants.ROUTER_CONFIG_FILE;

            const result = service.add(virtualHost);

            expect(result).toEqual(Promise.resolve(true));
            sinon.assert.calledWith(execStub, expectedCommand);
        });

        it('virtual host must be defined', () => {
            let virtualHost: VirtualHost;

            let result = service.add(virtualHost);

            expect(result).toEqual(Promise.resolve(false));

            virtualHost = null;

            result = service.add(virtualHost);

            expect(result).toEqual(Promise.resolve(false));

            virtualHost = new VirtualHost('id');

            result = service.add(virtualHost);

            expect(result).toEqual(Promise.resolve(false));

            virtualHost.address = 'address';

            result = service.add(virtualHost);

            expect(result).toEqual(Promise.resolve(false));

            delete virtualHost.id;
            virtualHost.ip = 'ip';

            result = service.add(virtualHost);

            expect(result).toEqual(Promise.resolve(false));
        });
    });

    describe('remove', () => {

        it('virtual host should be removed', () => {
            const vHost: VirtualHost = new VirtualHost('e4ef2b5b9f98', '10.0.10.225', 'http://test-address.com');
            const stub: SinonStub = sinon.stub(cliService, 'exec');
            stub.returns(Promise.resolve(true));
            const expectedCommand: string = `sed -i -- '/^    #id=${vHost.id}/,/^    #end/{d}' ${Constants.ROUTER_CONFIG_FILE}`;
            const expectedResult = Promise.resolve(true);

            const result = service.remove(vHost);

            expect(result).toEqual(expectedResult);
            sinon.assert.calledWith(stub, expectedCommand);
        });

        it('virtual host id should be required', () => {
            let vHost: VirtualHost;
            const expectedResult = Promise.resolve(false);

            let result = service.remove(vHost);

            expect(result).toEqual(expectedResult);

            vHost = new VirtualHost(null, '127.0.0.1', 'http://address.com');

            result = service.remove(vHost);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('getDescription', () => {

        it('description should be formatted', () => {
            const vHost: VirtualHost = new VirtualHost('e4ef2b5b9f98', '10.0.10.225', 'http://test-address.com');
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

            let result: string = service.getDescription(vHost);

            expect(result).toBe(expectedResult);

            vHost.address += '/';

            result = service.getDescription(vHost);

            expect(result).toBe(expectedResult);
        });

        it('virtual host or any field is undefined', () => {
            let vHost: VirtualHost;

            let result: string = service.getDescription(vHost);

            expect(result).toBe('');

            vHost = new VirtualHost();

            result = service.getDescription(vHost);

            expect(result).toBe('');

            vHost.address = 'http://test-address.com';

            result = service.getDescription(vHost);

            expect(result).toBe('');

            vHost.ip = '10.0.10.225';

            result = service.getDescription(vHost);

            expect(result).toBe('');

            delete vHost.address;

            result = service.getDescription(vHost);

            expect(result).toBe('');
        });
    });
});
