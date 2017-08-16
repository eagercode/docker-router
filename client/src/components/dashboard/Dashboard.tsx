import * as React from 'react';
import Container from '../../model/Container';
import Utils from '../../utils/Utils';
import ContainerBox from '../container/ContainerBox';

interface State {

    containers?: Container[];
    errors?: {};
}

export default class Dashboard extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);

        this.state = {containers: []};
        this.load();
    }

    load(): void {
        Utils.ajaxGet('/container/').then((containers: Container[]) => this.setState({containers}))
            .catch((errors: {}) => this.setState({errors}));
    }

    render(): JSX.Element {
        return (
            <div>
                {this.state.containers ? this.state.containers.map((container: Container) =>
                    <ContainerBox key={container.id} container={container}/>
                ) : ''}
            </div>
        );
    }
}
