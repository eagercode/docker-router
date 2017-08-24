import VirtualHost from '../../../src/model/VirtualHost';
import VirtualHostService from '../../../src/services/VirtualHostService';

describe('VirtualHostService', () => {

    let service: VirtualHostService;

    beforeEach(() => {
        service = new VirtualHostService([]);
    });

    describe('getVirtualHostDescription', () => {

        it('virtual host description should be formatted', () => {
            const virtualHost: VirtualHost = new VirtualHost('http://test-address.com', '10.0.10.225');
            const expectedResult: string = '    upstream localhost {\n' +
                '        server 10.0.10.225;\n' +
                '    }\n' +
                '\n' +
                '    server {\n' +
                '        server_name test-address.com;\n' +
                '\n' +
                '        location / {\n' +
                '            proxy_pass         http://test-address.com;\n' +
                '            proxy_redirect     off;\n' +
                '            proxy_set_header   Host $host;\n' +
                '            proxy_set_header   X-Real-IP $remote_addr;\n' +
                '            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;\n' +
                '            proxy_set_header   X-Forwarded-Host $server_name;\n' +
                '        }\n' +
                '    }';

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
            delete virtualHost.address;

            result = service.getVirtualHostDescription(virtualHost);

            expect(result).toBe('');
        });
    });
});
