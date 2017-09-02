import Container from '../model/Container';
import DockerService from './DockerService';
import VirtualHost from '../model/VirtualHost';
import VirtualHostService from './VirtualHostService';

export default class ContainerService {

    constructor(private dockerService = new DockerService(),
                private virtualHostService = new VirtualHostService()) {
    }

    async getAll(): Promise<Container[]> {
        try {
            const [containers, vHosts] = await Promise.all([this.dockerService.ps(), this.virtualHostService.getAll()]);
            return this.mergeContainersAndVHosts(containers, vHosts);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private mergeContainersAndVHosts(containers: Container[], vHosts: { [key: string]: VirtualHost }): Promise<Container[]> {
        containers
            .filter((container: Container): boolean => !!vHosts[container.id])
            .forEach((container: Container) => {
                container.ip = vHosts[container.id].ip;
                container.address = vHosts[container.id].address;
            });

        return Promise.resolve(containers);
    }
}
