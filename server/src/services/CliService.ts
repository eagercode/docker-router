const childProcess = require('child_process');

export default class CliService {

    exec(command: string): Promise<string> {
        return new Promise<string>((resolve: (result: string) => void, reject: (err: string) => void) => {
            if (command) {
                childProcess.exec(command, (error: string, stdout: string, stderr: string): void => {
                    if (error) {
                        reject(error);
                    } else if (stderr) {
                        reject(error);
                    } else {
                        resolve(stdout);
                    }
                });
            } else {
                reject('Shell command is required');
            }
        });
    }
}
