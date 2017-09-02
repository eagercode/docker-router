import VirtualHostConverter from '../../../src/converters/VirtualHostConverter';
import VirtualHost from '../../../src/model/VirtualHost';

describe('VirtualHostConverter', () => {

    let converter: VirtualHostConverter;

    beforeEach(() => converter = new VirtualHostConverter());

    describe('strToVirtualHost', () => {

        it('string should be converted to VirtualHost', () => {
            const vHostStr: string = `
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
    #end`;
            const expectedResult: VirtualHost = new VirtualHost('5771cb594cf6', '127.0.0.1', 'http://test.env.eu');

            const result = converter.strToVirtualHost(vHostStr);

            expect(result).toEqual(expectedResult);
        });

        it('string should be required', () => {
            let vHostStr: string;

            let result = converter.strToVirtualHost(vHostStr);

            expect(result).toBeNull();

            vHostStr = null;

            result = converter.strToVirtualHost(vHostStr);

            expect(result).toBeNull();

            vHostStr = '';

            result = converter.strToVirtualHost(vHostStr);

            expect(result).toBeNull();
        });

        it(`incomplete string shouldn't be converted`, () => {
            const vHost: string = `
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
    }`;

            const result = converter.strToVirtualHost(vHost);

            expect(result).toBeNull();
        });
    });

    describe('strToVirtualHosts', () => {

        it('string should be converted to VirtualHosts', () => {
            const vHostsStr: string = `
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
    #end`;
            const expectedResult: VirtualHost[] = [
                new VirtualHost('0509b6c18de7', '10.11.12.13', 'https://url.org'),
                new VirtualHost('5771cb594cf6', '127.0.0.1', 'http://test.env.eu'),
                new VirtualHost('3549d4f07au3', '192.168.1.124', 'http://intranet'),
            ];

            const result = converter.strToVirtualHosts(vHostsStr);

            expect(result).toEqual(expectedResult);
        });

        it('string should be required', () => {
            let vHostsStr: string;

            let result = converter.strToVirtualHosts(vHostsStr);

            expect(result).toEqual([]);

            vHostsStr = null;

            result = converter.strToVirtualHosts(vHostsStr);

            expect(result).toEqual([]);

            vHostsStr = '';

            result = converter.strToVirtualHosts(vHostsStr);

            expect(result).toEqual([]);
        });
    });

    describe('virtualHostToStr', () => {

        it('virtual host should be converted to string', () => {
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

            let result: string = converter.virtualHostToStr(vHost);

            expect(result).toBe(expectedResult);

            vHost.address += '/';

            result = converter.virtualHostToStr(vHost);

            expect(result).toBe(expectedResult);
        });

        it('virtual host and it\'s fields should be required', () => {
            let vHost: VirtualHost;

            let result: string = converter.virtualHostToStr(vHost);

            expect(result).toBe('');

            vHost = new VirtualHost();

            result = converter.virtualHostToStr(vHost);

            expect(result).toBe('');

            vHost.address = 'http://test-address.com';

            result = converter.virtualHostToStr(vHost);

            expect(result).toBe('');

            vHost.ip = '10.0.10.225';

            result = converter.virtualHostToStr(vHost);

            expect(result).toBe('');

            delete vHost.address;

            result = converter.virtualHostToStr(vHost);

            expect(result).toBe('');
        });
    });
});
