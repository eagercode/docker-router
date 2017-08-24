import CliService from './CliService';
import VirtualHost from '../model/VirtualHost';

export default class VirtualHostService {

    constructor(private virtualHosts?: VirtualHost[],
                private cliService: CliService = new CliService()) {
        if (!virtualHosts) {
            this.load();
        }
    }

    addVirtualHost(virtualHost: VirtualHost): Promise<boolean> {
        return Promise.resolve(true);
    }

    getVirtualHostDescription(virtualHost: VirtualHost): string {
        if (!virtualHost || !virtualHost.address || !virtualHost.ip) {
            return '';
        }

        return `    upstream localhost {
        server ${virtualHost.ip};
    }

    server {
        server_name ${this.getServerName(virtualHost.address)};

        location / {
            proxy_pass         ${this.removeLastForwardSlash(virtualHost.address)};
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }`;
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

    private load(): void {

    }
}
