import Container from '../model/Container';

export default class ContainerConverter {

    convertOne(headerStr: string, containerStr: string): Container {
        if (headerStr && containerStr) {
            const args: string[] = this.convertContainerStrToArray(headerStr, containerStr);
            return new Container(args[0] || null, args[1] || null, args[2] || null, args[3] || null, args[4] || null, args[5] || null, args[6] || null);
        } else {
            return null;
        }
    }

    convertList(containersStr: string): Container[] {
        if (containersStr) {
            const containers: string[] = containersStr.split('\n');
            return containers.slice(1, -1).map((container: string): Container => this.convertOne(containers[0], container));
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
