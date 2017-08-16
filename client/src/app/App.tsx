import * as React from 'react';
import Dashboard from '../components/dashboard/Dashboard';
import './App.css';
import { AppBar } from 'material-ui';

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="App">
                <AppBar
                    iconElementLeft={<span/>}
                    title="Docker Router"
                />
                <Dashboard/>
            </div>
        );
    }
}
