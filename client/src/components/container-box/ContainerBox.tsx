import * as React from 'react';
import { List, ListItem } from 'material-ui';
import Container from '../../model/Container';
import Indicator from '../indicator/Indicator';
import Div from './ContainerBox.sc';

interface Props {

    container: Container;
}

export default class ContainerBox extends React.Component<Props, {}> {

    render(): JSX.Element {
        return (
            <Div>
                <Indicator isActive={!!this.props.container.isActive}/>
                <List>
                    <ListItem
                        disabled={true}
                        primaryText={this.props.container.name}
                        secondaryText="Container Name"
                    />
                    <ListItem
                        disabled={true}
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
            </Div>
        );
    }
}
