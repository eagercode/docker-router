import Constants from '../common/Constants';
import Container from '../model/Container';
import DockerService from './DockerService';
import VirtualHost from '../model/VirtualHost';
import VirtualHostService from './VirtualHostService';

const os = require('os');

export default class InitializationService {

    constructor(private dockerService: DockerService = new DockerService(),
                private virtualHostService: VirtualHostService = new VirtualHostService()) {
    }

    async init(): Promise<boolean> {
        try {
            const containers: Container[] = await this.dockerService.ps();
            const router: Container = this.getContainerByName(containers, Constants.ROUTER_CONTAINER_NAME);

            if (router && router.isActive) {
                await this.virtualHostService.update(this.getWebContainerVirtualHost(containers));
                return this.dockerService.restart(Constants.ROUTER_CONTAINER_NAME);
            } else {
                return this.virtualHostService.update(this.getWebContainerVirtualHost(containers));
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private getContainerByName(containers: Container[], name: string): Container {
        const filteredContainers = containers.filter((container: Container) => container.name === name);
        return filteredContainers[0] ? filteredContainers[0] : null;
    }

    private getWebContainerVirtualHost(containers: Container[]): VirtualHost {
        const webContainer: Container = this.getContainerByName(containers, Constants.WEB_CONTAINER_NAME);
        return webContainer != null ? new VirtualHost(webContainer.id, this.getIpAddress(), Constants.WEB_CONTAINER_ADDRESS, Constants.WEB_CONTAINER_NAME) : null;
    }

    private getIpAddress(): string {
        return os.networkInterfaces().eth0[0].address;
    }
}
