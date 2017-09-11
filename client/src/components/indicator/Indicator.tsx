import * as React from 'react';
import Span from './Indicator.sc';

export interface Props {

    isActive: boolean;
}

export default class Indicator extends React.Component<Props, {}> {

    render(): JSX.Element {
        return (
            <Span isActive={this.props.isActive}/>
        );
    }
}
