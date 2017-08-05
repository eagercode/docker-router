import CliService from '../../../src/services/CliService';

const sinon = require('sinon');

describe('CliService', () => {

    describe('exec', () => {

        it('shell command is null', (done: DoneFn): void => {
            const result: Promise<string> = CliService.exec(null);

            result.then((result: string): void => done.fail(result))
                .catch((error: string): void => {
                    if (error) {
                        done();
                    }
                });
        });

        it('with shell command', (done: DoneFn): void => {
            const childProcess = require('child_process');
            const expectedResult: string = 'expected result';

            const fakeFn = (command: string, callBack: (error: string, stdout: string, stderr: string) => void) => callBack(null, expectedResult, null);
            sinon.stub(childProcess, 'exec').callsFake(fakeFn);

            const result: Promise<string> = CliService.exec('command');

            result.then((result: string): void => {
                expect(result).toEqual(expectedResult);
                done();
            }).catch((error: string): void => done.fail(error));
        });
    });
});
