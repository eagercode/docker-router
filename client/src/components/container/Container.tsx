import * as React from 'react';

export default class Container extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
    }

    render(): JSX.Element {
        return (
            <div>
                <h1>Ze Container</h1>
            </div>
        );
    }
}
