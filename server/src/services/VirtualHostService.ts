import CliService from './CliService';
import Constants from '../common/Constants';
import VirtualHost from '../model/VirtualHost';
import VirtualHostConverter from '../converters/VirtualHostConverter';

export default class VirtualHostService {

    constructor(private cliService: CliService = new CliService(),
                private virtualHostConverter: VirtualHostConverter = new VirtualHostConverter()) {
    }

    getAll(): Promise<{ [key: string]: VirtualHost }> {
        const command: string = `sed -e '/^    #id=/,/^    #end/!d' ${Constants.ROUTER_CONFIG_FILE}`;

        return new Promise((resolve: (result: { [id: string]: VirtualHost }) => void, reject: (err: string) => void) => {
            this.cliService.exec(command)
                .then((vHostsStr: string) => resolve(this.getVirtualHostsMap(this.virtualHostConverter.strToVirtualHosts(vHostsStr))))
                .catch((err: string) => reject(err));
        });
    }

    add(vHost: VirtualHost): Promise<boolean> {
        if (!vHost || !vHost.id || !vHost.ip || !vHost.address) {
            return Promise.resolve(false);
        }

        const command: string = `sed -i -- 's@#v_hosts@#v_hosts\\n\\n${this.virtualHostConverter.virtualHostToStr(vHost)}@g' ${Constants.ROUTER_CONFIG_FILE}`;
        return this.cliService.exec(command)
            .then(() => true)
            .catch((err: string) => {
                console.error(err);
                return false;
            });
    }

    remove(vHost: VirtualHost): Promise<boolean> {
        if (!vHost || !vHost.id) {
            return Promise.resolve(false);
        }

        const command: string = `sed -i -- '/^    #id=${vHost.id}/,/^    #end/{d}' ${Constants.ROUTER_CONFIG_FILE}`;
        return this.cliService.exec(command)
            .then(() => true)
            .catch((err: string) => {
                console.error(err);
                return false;
            });
    }

    private getVirtualHostsMap(vHosts: VirtualHost[]): { [id: string]: VirtualHost } {
        const result: { [id: string]: VirtualHost } = {};

        if (!vHosts) {
            return result;
        }

        vHosts.filter((vHost: VirtualHost) => !!vHost).forEach((vHost: VirtualHost) => result[vHost.id] = vHost);

        return result;
    }
}
