import * as React from 'react';
import './Indicator.css';

interface Props {

    isActive?: boolean;
}

export default class Indicator extends React.Component<Props, {}> {

    getClassName(): string {
        let result: string = 'Indicator ';

        result += (this.props.isActive) ? 'Indicator-green' : 'Indicator-red';

        return result;
    }

    render(): JSX.Element {
        return (
            <span className={this.getClassName()}/>
        );
    }
}
