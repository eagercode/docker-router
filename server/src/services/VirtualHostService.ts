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
            proxy_pass         ${virtualHost.address};
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }`;
    }

    private getServerName(urlAddress: string): string {
        const result: string = urlAddress.substring(urlAddress.indexOf('//') + 2);
        return result[result.length - 1] === '/' ? result.substring(result.length - 1) : result;
    }

    private load(): void {

    }
}
