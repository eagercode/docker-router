import * as React from 'react';
import Container from '../../model/Container';
import { Paper } from 'material-ui';

interface Props {

    container: Container;
}

export default class ContainerBox extends React.Component<Props, {}> {

    render(): JSX.Element {
        return (
            <div>
                <Paper zDepth={1}>
                    <b>ID: </b>
                    <span>{this.props.container.id}</span>
                    <b>Name: </b>
                    <span>{this.props.container.name}</span>
                </Paper>
            </div>
        );
    }
}
