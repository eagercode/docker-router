import CliService from './CliService';
import Constants from '../common/Constants';
import VirtualHost from '../model/VirtualHost';

export default class VirtualHostService {

    constructor(private virtualHosts?: VirtualHost[],
                private cliService: CliService = new CliService()) {
        if (!virtualHosts) {
            this.load();
        }
    }

    add(virtualHost: VirtualHost): Promise<boolean> {
        if (!this.isValid(virtualHost)) {
            return Promise.resolve(false);
        }

        const command: string = 'sed -i -- \'s@#v_hosts@#v_hosts\\n\\n' + this.getDescription(virtualHost) +
            '@g\' ' + Constants.ROUTER_CONFIG_FILE;
        return this.cliService.exec(command)
            .then(() => true)
            .catch((err: string) => {
                console.error(err);
                return false;
            });
    }

    remove(virtualHost: VirtualHost): Promise<boolean> {
        if (!virtualHost || !virtualHost.id) {
            return Promise.resolve(false);
        }

        const command: string = `sed -i -- \'/^    #id=${virtualHost.id}/,/^    #end/{d}\' ${Constants.ROUTER_CONFIG_FILE}`;
        return this.cliService.exec(command)
            .then(() => true)
            .catch((err: string) => {
                console.error(err);
                return false;
            });
    }

    getDescription(virtualHost: VirtualHost): string {
        if (!this.isValid(virtualHost)) {
            return '';
        }

        return '    #id=' + virtualHost.id + '\\n' +
            '    upstream localhost {\\n' +
            '        server ' + virtualHost.ip + ';\\n' +
            '    }\\n\\n' +
            '    server {\\n' +
            '        server_name ' + this.getServerName(virtualHost.address) + ';\\n\\n' +
            '        location / {\\n' +
            '            proxy_pass         ' + this.removeLastForwardSlash(virtualHost.address) + ';\\n' +
            '            proxy_redirect     off;\\n' +
            '            proxy_set_header   Host $host;\\n' +
            '            proxy_set_header   X-Real-IP $remote_addr;\\n' +
            '            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;\\n' +
            '            proxy_set_header   X-Forwarded-Host $server_name;\\n' +
            '        }\\n' +
            '    }\\n' +
            '    #end';
    }

    private isValid(vHost: VirtualHost): boolean {
        return vHost && vHost.id && vHost.ip && vHost.address ? true : false;
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
