import * as React from 'react';
import { AppBar } from 'material-ui';
import Dashboard from '../components/dashboard/Dashboard';
import Div from './App.sc';
import GitHub from '../components/GitHub/GitHub';

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <Div>
                <AppBar
                    iconElementLeft={<GitHub/>}
                    title="Docker Router"
                />
                <Dashboard/>
            </Div>
        );
    }
}
