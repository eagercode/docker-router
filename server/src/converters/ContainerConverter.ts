import Container from '../model/Container';

export default class ContainerConverter {

    strToContainer(headerStr: string, containerStr: string): Container {
        if (headerStr && containerStr) {
            const args: string[] = this.convertContainerStrToArray(headerStr, containerStr);
            const isActive: boolean = args[4] ? args[4].indexOf('Up') > -1 : false;
            return new Container(args[0] || '', args[1] || '', args[2] || '', args[3] || '', args[4] || '', args[5] || '', args[6] || '', isActive);
        } else {
            return null;
        }
    }

    strToContainers(containersStr: string): Container[] {
        if (containersStr) {
            const containers: string[] = containersStr.split('\n');
            return containers.slice(1, -1).map((container: string): Container => this.strToContainer(containers[0], container));
        } else {
            return [];
        }
    }

    private convertContainerStrToArray(headerStr: string, containerStr: string): string[] {
        const result: string[] = [];
        const header: string = headerStr.replace('CONTAINER ID', 'CONTAINER_ID');
        const headerColumns: string[] = header.trim().split(/\ +/);

        headerColumns.forEach((column: string, index: number) => {
            const from: number = header.indexOf(column);
            const to: number = (index + 1 < headerColumns.length) ? header.indexOf(headerColumns[index + 1]) : containerStr.length;

            result.push(containerStr.substring(from, to).trim());
        });

        return result;
    }
}
