import Container from '../../../src/model/Container';
import ContainerBuilder from '../../builders/ContainerBuilder';
import ContainerConverter from '../../../src/converters/ContainerConverter';

describe('ContainerConverter', () => {

    let converter: ContainerConverter;

    beforeEach(() => converter = new ContainerConverter());

    describe('convertOne', () => {

        it('container string is null', () => {
            const containerInfo: string = null;

            const result: Container = converter.convertOne(containerInfo);

            expect(result).toBeNull();
        });

        it('string is container info', () => {
            const containerInfo: string = 'Container info';
            const expectedResult: Container = new Container(containerInfo);

            const result: Container = converter.convertOne(containerInfo);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('convertList', () => {

        it('container string is null', () => {
            const result: Container[] = converter.convertList(null);

            expect(result).toEqual([]);
        });

        it('string is list of containers', () => {
            const str: string = 'First container\nSecond container';
            const expectedResult: Container[] = [
                new ContainerBuilder().withTitle('First container').build(),
                new ContainerBuilder().withTitle('Second container').build(),
            ];

            const result: Container[] = converter.convertList(str);

            expect(result).toEqual(expectedResult);
        });
    });
});
