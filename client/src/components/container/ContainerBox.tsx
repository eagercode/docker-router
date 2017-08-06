import * as React from 'react';
import Constants from '../../common/Constants';
import Container from '../../model/Container';
import Utils from '../../utils/Utils';

interface State {

    errors?: {};
    title?: string;

}

export default class ContainerBox extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);

        this.state = {};
        this.load();
    }

    load(): void {
        Utils.ajaxGet(Constants.REST_API_PREFIX + '/container/').then((result: Container[]) => {
            this.setState({
                title: result[0].id + ' ' + result[0].image + ' ' + result[0].name
            });
        }).catch((err: {}) => this.setState({errors: err}));
    }

    render(): JSX.Element {
        return (
            <div>
                <h1>{this.state.title}</h1>
            </div>
        );
    }
}
