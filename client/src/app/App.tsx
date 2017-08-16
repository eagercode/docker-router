import * as React from 'react';
import { AppBar } from 'material-ui';
import Dashboard from '../components/dashboard/Dashboard';
import GitHub from '../components/GitHub/GitHub';
import './App.css';

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="App">
                <AppBar
                    iconElementLeft={<GitHub/>}
                    title="Docker Router"
                />
                <Dashboard/>
            </div>
        );
    }
}
