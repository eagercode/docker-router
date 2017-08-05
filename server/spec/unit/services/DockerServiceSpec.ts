import DockerService from '../../../src/services/DockerService';

describe('DockerService', () => {

    let dockerService: DockerService;

    beforeEach(() => dockerService = new DockerService());

    describe('ps', () => {

        it('shell command `docker ps` should be executed', () => {
            expect(dockerService).not.toBeNull();
        });

    });

});
