import * as React from 'react';
import ContainerBox from '../components/container/ContainerBox';
import './App.css';

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>Docker Router</h2>
                </div>
                <ContainerBox/>
            </div>
        );
    }
}

export default App;
