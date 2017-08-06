import Container from '../model/Container';

export default class ContainerConverter {

    convertOne(containerStr: string): Container {
        if (containerStr) {
            return new Container(containerStr);
        } else {
            return null;
        }
    }

    convertList(containersStr: string): Container[] {
        if (containersStr) {
            return containersStr.split('\n').map((container: string): Container => this.convertOne(container));
        } else {
            return [];
        }
    }
}
