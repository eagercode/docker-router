import * as React from 'react';
import Container from '../../model/Container';
import ContainerBox from '../container-box/ContainerBox';
import Utils from '../../utils/Utils';
import './Dashboard.css';

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
        Utils.ajaxGet('/container/').then((containers: Container[]) => this.setContainers(containers))
            .catch((errors: {}) => this.setState({errors}));
    }

    setContainers(containers: Container[]): void {
        const comparator = (c1: Container, c2: Container): number => (c1.isActive === c2.isActive) ? 0 : (c1.isActive) ? -1 : 1;
        containers = containers.sort(comparator);
        this.setState({containers});
    }

    render(): JSX.Element {
        return (
            <div className="Dashboard">
                {this.state.containers ? this.state.containers.map((container: Container) =>
                    <ContainerBox key={container.id} container={container}/>
                ) : ''}
            </div>
        );
    }
}
