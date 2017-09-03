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
            return this.virtualHostService.update(new VirtualHost(this.getWebContainerId(containers), this.getIpAddress(), Constants.WEB_CONTAINER_ADDRESS));
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private getIpAddress(): string {
        return os.networkInterfaces().eth0[0].address;
    }

    private getWebContainerId(containers: Container[]): string {
        const filteredContainers = containers.filter((container: Container) => container.name === Constants.WEB_CONTAINER_NAME);
        return filteredContainers[0] ? filteredContainers[0].id : null;
    }
}
