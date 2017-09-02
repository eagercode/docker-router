import { SinonStub } from 'sinon';

import CliService from '../../../src/services/CliService';
import Constants from '../../../src/common/Constants';
import VirtualHost from '../../../src/model/VirtualHost';
import VirtualHostService from '../../../src/services/VirtualHostService';

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

    describe('load', () => {
        it('virtual hosts should be loaded', () => {
            const expectedCommand: string = `sed -e '/^    #id=/,/^    #end/!d' ${Constants.ROUTER_CONFIG_FILE}`;
            const stub: SinonStub = sinon.stub(cliService, 'exec');
            stub.returns(Promise.resolve(`
    #id=0509b6c18de7
    upstream localhost {
        server 10.11.12.13;
    }

    server {
        server_name url.org;

        location / {
            proxy_pass         https://url.org;
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }
    #end
    #id=5771cb594cf6
    upstream localhost {
        server 127.0.0.1;
    }

    server {
        server_name test.env.eu;

        location / {
            proxy_pass         http://test.env.eu;
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }
    #end
    #id=3549d4f07au3
    upstream localhost {
        server 192.168.1.124;
    }

    server {
        server_name intranet;

        location / {
            proxy_pass         http://intranet;
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }
    #end`));
            const expectedResult: VirtualHost[] = [
                new VirtualHost('0509b6c18de7', '10.11.12.13', 'https://url.org'),
                new VirtualHost('5771cb594cf6', '127.0.0.1', 'http://test.env.eu'),
                new VirtualHost('3549d4f07au3', '192.168.1.124', 'http://intranet'),
            ];

            service.load();

            sinon.assert.calledWith(stub, expectedCommand);
            expect(service.getAll()).toEqual(Promise.resolve(expectedResult));
        });

        it('virtual hosts str should not be required', () => {
            const stub: SinonStub = sinon.stub(cliService, 'exec');
            stub.returns(Promise.resolve(null));

            service.load();

            expect(service.getAll()).toEqual(Promise.resolve([]));

            stub.returns(Promise.resolve(''));

            service.load();

            expect(service.getAll()).toEqual(Promise.resolve([]));


            stub.returns(Promise.resolve(`
    upstream localhost {
        server 192.168.1.124;
    }

    server {
        server_name intranet;

        location / {
            proxy_pass         http://intranet;
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }`));

            service.load();

            expect(service.getAll()).toEqual(Promise.resolve([]));
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
