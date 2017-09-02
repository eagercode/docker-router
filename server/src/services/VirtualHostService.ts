import CliService from './CliService';
import Constants from '../common/Constants';
import VirtualHost from '../model/VirtualHost';
import VirtualHostConverter from '../converters/VirtualHostConverter';

export default class VirtualHostService {

    constructor(private virtualHosts?: VirtualHost[],
                private cliService: CliService = new CliService(),
                private virtualHostConverter: VirtualHostConverter = new VirtualHostConverter()) {
        if (!virtualHosts) {
            this.load();
        }
    }

    load(): void {
        const command: string = `sed -e '/^    #id=/,/^    #end/!d' ${Constants.ROUTER_CONFIG_FILE}`;

        this.cliService.exec(command)
            .then((vHostsStr: string) => this.virtualHosts.push(...this.virtualHostConverter.strToVirtualHosts(vHostsStr)));
    }

    getAll(): Promise<VirtualHost[]> {
        return Promise.resolve(this.virtualHosts);
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
}
