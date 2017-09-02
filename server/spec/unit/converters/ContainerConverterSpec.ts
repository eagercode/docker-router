import Container from '../../../src/model/Container';
import ContainerConverter from '../../../src/converters/ContainerConverter';

describe('ContainerConverter', () => {

    let converter: ContainerConverter;

    beforeEach(() => converter = new ContainerConverter());

    describe('strToContainer', () => {

        it('container string is null', () => {
            let result: Container = converter.strToContainer(null, null);

            expect(result).toBeNull();

            result = converter.strToContainer('Header', null);

            expect(result).toBeNull();

            result = converter.strToContainer(null, 'Container info');

            expect(result).toBeNull();
        });

        it('active container info', () => {
            const headerStr: string =    'CONTAINER ID        IMAGE               COMMAND               CREATED             STATUS              PORTS                    NAMES';
            const containerStr: string = '10554ce91a88        dockerrouter_web    "npm run start-dev"   28 hours ago        Up 11 minutes       0.0.0.0:8000->8000/tcp   dockerrouter_web_1';
            const expectedResult: Container = new Container('10554ce91a88', 'dockerrouter_web', '"npm run start-dev"', '28 hours ago', 'Up 11 minutes', '0.0.0.0:8000->8000/tcp', 'dockerrouter_web_1', true);

            const result: Container = converter.strToContainer(headerStr, containerStr);

            expect(result).toEqual(expectedResult);
        });

        it('stopped container info', () => {
            const headerStr: string =    'CONTAINER ID        IMAGE               COMMAND                   CREATED             STATUS                         PORTS            NAMES';
            const containerStr: string = 'e7b316865c96        0cde913b8078        "npm run start-dev"       4 days ago          Exited (127) 4 days ago                         zen_spence';
            const expectedResult: Container = new Container('e7b316865c96', '0cde913b8078', '"npm run start-dev"', '4 days ago', 'Exited (127) 4 days ago', '', 'zen_spence', false);

            const result: Container = converter.strToContainer(headerStr, containerStr);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('strToContainers', () => {

        it('containers string is null', () => {
            const result: Container[] = converter.strToContainers(null);

            expect(result).toEqual([]);
        });

        it('string is list of containers', () => {
            const containersStr: string = [
                'CONTAINER ID        IMAGE               COMMAND               CREATED             STATUS                       PORTS                    NAMES',
                'e7b316865c96        0cde913b8078        "npm run start-dev"   4 days ago          Exited (127) 4 days ago                               zen_spence',
                '10554ce91a88        dockerrouter_web    "npm run start-dev"   28 hours ago        Up 11 minutes                0.0.0.0:8000->8000/tcp   dockerrouter_web_1',
                '',
            ].join('\n');
            const expectedResult: Container[] = [
                new Container('e7b316865c96', '0cde913b8078', '"npm run start-dev"', '4 days ago', 'Exited (127) 4 days ago', '', 'zen_spence', false),
                new Container('10554ce91a88', 'dockerrouter_web', '"npm run start-dev"', '28 hours ago', 'Up 11 minutes', '0.0.0.0:8000->8000/tcp', 'dockerrouter_web_1', true),
            ];

            const result: Container[] = converter.strToContainers(containersStr);

            expect(result).toEqual(expectedResult);
        });
    });
});
