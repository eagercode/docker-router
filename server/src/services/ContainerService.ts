import Container from '../model/Container';
import DockerService from './DockerService';
import VirtualHostService from './VirtualHostService';

export default class ContainerService {

    constructor(private dockerService = new DockerService(),
                private virtualHostService = new VirtualHostService()) {
    }

    async getAll(): Promise<Container[]> {
        const [containers, vHosts] = await Promise.all([this.dockerService.ps(), this.virtualHostService.getAll()]);

        containers.forEach((container: Container) => container.vHost = vHosts[container.id]);

        return Promise.resolve(containers);
    }
}
