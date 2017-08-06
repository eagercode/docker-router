import Container from '../../../src/model/Container';
import ContainerConverter from '../../../src/converters/ContainerConverter';

describe('ContainerConverter', () => {

    let converter: ContainerConverter;

    beforeEach(() => converter = new ContainerConverter());

    describe('convertOne', () => {

        it('container string is null', () => {
            let result: Container = converter.convertOne(null, null);

            expect(result).toBeNull();

            result = converter.convertOne('Header', null);

            expect(result).toBeNull();

            result = converter.convertOne(null, 'Container info');

            expect(result).toBeNull();
        });

        it('string is container info', () => {
            const headerStr: string = 'ID   IMAGE     COMMAND     CREATED     STATUS   PORTS    NAMES';
            const containerStr: string = '1    image_1   command_1   created_1   status_1 ports_1  longer_name_1';
            const expectedResult: Container = new Container('1', 'image_1', 'command_1', 'created_1', 'status_1', 'ports_1', 'longer_name_1');

            const result: Container = converter.convertOne(headerStr, containerStr);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('convertList', () => {

        it('container string is null', () => {
            const result: Container[] = converter.convertList(null);

            expect(result).toEqual([]);
        });

        it('string is list of containers', () => {
            const containersStr: string = [
                'CONTAINER ID IMAGE     COMMAND   CREATED   STATUS   PORTS    NAMES',
                '1            image_1   command_1 created_1 status_1 ports_1  n1',
                '2            image_2   command_2 created_2 status_2 ports_2  name_2',
                '',
            ].join('\n');
            const expectedResult: Container[] = [
                new Container('1', 'image_1', 'command_1', 'created_1', 'status_1', 'ports_1', 'n1'),
                new Container('2', 'image_2', 'command_2', 'created_2', 'status_2', 'ports_2', 'name_2'),
            ];

            const result: Container[] = converter.convertList(containersStr);

            expect(result).toEqual(expectedResult);
        });
    });
});
