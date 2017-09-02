import VirtualHost from '../model/VirtualHost';

export default class VirtualHostConverter {

    strToVirtualHost(str: string): VirtualHost {
        if (!str) {
            return null;
        }

        const id = str.substring(str.indexOf('#id=') + 4, str.indexOf('upstream') - 5);
        const ip = str.substring(str.indexOf('server ') + 7, str.indexOf('server {') - 13);
        const address = str.substring(str.indexOf('proxy_pass         ') + 19, str.indexOf('proxy_redirect') - 14);

        return new VirtualHost(id, ip, address);
    }

    strToVirtualHosts(str: string): VirtualHost[] {
        if (!str) {
            return [];
        }

        return str.split('    #end').filter((item: string): boolean => !!item).map(this.strToVirtualHost);
    }

    virtualHostToStr(vHost: VirtualHost): string {
        if (!vHost || !vHost.id || !vHost.ip || !vHost.address) {
            return '';
        }

        return '    #id=' + vHost.id + '\\n' +
            '    upstream localhost {\\n' +
            '        server ' + vHost.ip + ';\\n' +
            '    }\\n\\n' +
            '    server {\\n' +
            '        server_name ' + this.getServerName(vHost.address) + ';\\n\\n' +
            '        location / {\\n' +
            '            proxy_pass         ' + this.removeLastForwardSlash(vHost.address) + ';\\n' +
            '            proxy_redirect     off;\\n' +
            '            proxy_set_header   Host $host;\\n' +
            '            proxy_set_header   X-Real-IP $remote_addr;\\n' +
            '            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;\\n' +
            '            proxy_set_header   X-Forwarded-Host $server_name;\\n' +
            '        }\\n' +
            '    }\\n' +
            '    #end';
    }

    private getServerName(urlAddress: string): string {
        if (!urlAddress) {
            return urlAddress;
        }

        return this.removeLastForwardSlash(urlAddress.substring(urlAddress.indexOf('//') + 2));
    }

    private removeLastForwardSlash(urlAddress: string): string {
        if (!urlAddress) {
            return urlAddress;
        }

        return urlAddress[urlAddress.length - 1] === '/' ? urlAddress.substring(0, urlAddress.length - 1) : urlAddress;
    }
}
