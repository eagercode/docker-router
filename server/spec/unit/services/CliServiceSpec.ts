import CliService from '../../../src/services/CliService';

describe('CliService', () => {

    describe('exec', () => {

        it('shell command is null', (done: DoneFn): void => {
            const command: string = null;

            const result: Promise<string> = CliService.exec(command);

            result.then((result: string): void => done.fail(result))
                .catch((error: string): void => {
                    if (error) {
                        done();
                    }
                });
        });

        it('with shell command', (done: DoneFn): void => {
            const command: string = 'cd';

            const result: Promise<string> = CliService.exec(command);

            result.then((result: string): void => {
                if (result) {
                    done();
                }
            }).catch((error: string): void => done.fail(error));
        });
    });
});
