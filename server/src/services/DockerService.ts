import CliService from './CliService';
import Container from '../model/Container';
import ContainerConverter from '../converters/ContainerConverter';

export default class DockerService {

    constructor(private cliService: CliService = new CliService(), private containerConverter: ContainerConverter = new ContainerConverter()) {
    }

    ps(): Promise<Container[]> {
        return this.getContainers('docker ps');
    }

    psAll(): Promise<Container[]> {
        return this.getContainers('docker ps -a');
    }

    private getContainers(command: string): Promise<Container[]> {
        return new Promise<Container[]>((resolve: (containers: Container[]) => void, reject: (error: string) => void): void => {
            this.cliService.exec(command)
                .then((result: string): void => resolve(this.containerConverter.convertList(result)))
                .catch((error: string): void => reject(error));
        });
    }
}
