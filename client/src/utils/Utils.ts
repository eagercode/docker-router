export default class Utils {

    static ajaxGet<T>(url: string): Promise<T> {
        let options = {
            method: 'GET'
        };

        return Utils.ajax(url, options);
    }

    static ajax<T>(url: string, options: {}): Promise<T> {
        return new Promise(function (resolve: (data: T) => void, reject: (error: {}) => void) {
            fetch(url, options).then((response: Response) => response.json().then((json: T) => ({
                    status: response.status,
                    json
                })
            )).then(
                (response: { status: number, json: T }) => {
                    if (response.status >= 400) {
                        reject(response.json);
                    } else {
                        resolve(response.json);
                    }
                },
                function (error: {}): void {
                    reject(error);
                }
            );
        });
    }

}