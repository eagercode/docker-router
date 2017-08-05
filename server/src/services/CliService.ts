const exec = require('child_process').exec;

export default class CliService {

    static exec(command: string): Promise<string> {
        return new Promise<string>((resolve: (result: string) => void, reject: (err: string) => void) => {
            if (command) {
                exec(command, (error: string, stdout: string, stderr: string): void => {
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
