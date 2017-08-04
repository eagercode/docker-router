import * as React from 'react';
import Container from '../components/container/Container';
import './App.css';

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>Docker Router</h2>
                </div>
                <Container/>
            </div>
        );
    }
}

export default App;
