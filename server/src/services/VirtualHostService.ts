import CliService from './CliService';
import Constants from '../common/Constants';
import VirtualHost from '../model/VirtualHost';
import VirtualHostConverter from '../converters/VirtualHostConverter';
import DockerService from './DockerService';

export default class VirtualHostService {

    constructor(private cliService: CliService = new CliService(),
                private dockerService: DockerService = new DockerService(),
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

    remove(id: string): Promise<boolean> {
        if (!id) {
            return Promise.resolve(false);
        }

        const command: string = `sed -i -- '/^    #id=${id}/,/^    #end/{d}' ${Constants.ROUTER_CONFIG_FILE}`;
        return this.cliService.exec(command)
            .then(() => true)
            .catch((err: string) => {
                console.error(err);
                return false;
            });
    }

    async update(vHost: VirtualHost): Promise<boolean> {
        if (!vHost || !vHost.id) {
            return Promise.reject(false);
        }

        try {
            await this.remove(vHost.id);
            await this.add(vHost);
            return this.dockerService.restart(Constants.ROUTER_CONTAINER_NAME);
        } catch (err) {
            return Promise.reject(err);
        }
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
