import CliService from './CliService';
import Constants from '../common/Constants';
import DockerService from './DockerService';
import VirtualHost from '../model/VirtualHost';
import VirtualHostConverter from '../converters/VirtualHostConverter';

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
        if (!vHost || !vHost.id || !vHost.ip || !vHost.address || !vHost.name) {
            return Promise.reject('Virtual host validation failed');
        }

        const command: string = `sed -i -- 's@#v_hosts@#v_hosts\\n${this.virtualHostConverter.virtualHostToStr(vHost)}@g' ${Constants.ROUTER_CONFIG_FILE}`;
        return this.cliService.exec(command)
            .then(() => true)
            .catch((err: string) => {
                console.error(err);
                return false;
            });
    }

    remove(id: string): Promise<boolean> {
        if (!id) {
            return Promise.reject('Id is required');
        }

        const command: string = `sed -i -- '/^    #id=${id}/,/^    #end/{d}' ${Constants.ROUTER_CONFIG_FILE}`;
        return this.cliService.exec(command)
            .then(() => true)
            .catch((err: string) => {
                console.error(err);
                return false;
            });
    }

    removeByName(name: string): Promise<boolean> {
        if (!name) {
            return Promise.reject('Name is required');
        }

        const command: string = `sed -i -- '/,name=${name}/,/^    #end/{d}' ${Constants.ROUTER_CONFIG_FILE}`;
        return this.cliService.exec(command)
            .then(() => true)
            .catch((err: string) => {
                console.error(err);
                return false;
            });
    }

    async update(vHost: VirtualHost): Promise<boolean> {
        if (!vHost || !vHost.id || !vHost.name) {
            return Promise.reject(false);
        }

        try {
            await this.remove(vHost.id);
            await this.removeByName(vHost.name);
            return this.add(vHost);
        } catch (error) {
            return Promise.reject(error);
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
