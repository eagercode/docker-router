export default class Utils {

    static ajaxGet<T>(url: string): Promise<T> {
        let options = {
            method: 'GET'
        };

        return Utils.ajax(process.env.REACT_APP_API_HOST + url, options);
    }

    static ajax<T>(url: string, options: {}): Promise<T> {
        return new Promise((resolve: (data: T) => void, reject: (error: {}) => void) => fetch(url, options)
            .then((response: Response) => response.json()
                .then((json: T) => ({
                        status: response.status,
                        json
                    })
                )
            )
            .then(
                (response: { status: number, json: T }): void => {
                    if (response.status >= 400) {
                        reject(response.json);
                    } else {
                        resolve(response.json);
                    }
                },
                (error: {}): void => reject(error)
            )
        );
    }

}