import * as React from 'react';
import ContainerBox from '../components/container/ContainerBox';
import './App.css';

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="App">
                <ContainerBox/>
            </div>
        );
    }
}
