import * as React from 'react';
import Container from '../../model/Container';
import { List, ListItem } from 'material-ui';
import './ContainerBox.css';

interface Props {

    container: Container;
}

export default class ContainerBox extends React.Component<Props, {}> {

    render(): JSX.Element {
        return (
            <div className="ContainerBox">
                <List>
                    <ListItem
                        primaryText={this.props.container.name}
                        secondaryText="Container Name"
                    />
                    <ListItem
                        primaryText={this.props.container.image}
                        secondaryText="Image"
                    />
                    {this.props.container.status ?
                    <ListItem
                        disabled={true}
                        primaryText={this.props.container.status}
                        secondaryText="Status"
                    /> : ''}
                </List>
            </div>
        );
    }
}
