import * as React from 'react';
import * as PropTypes from 'prop-types';
import { mount, ReactWrapper } from 'enzyme';
import { getMuiTheme } from 'material-ui/styles';
import App from './App';
import AppBar from 'material-ui/AppBar';
import Dashboard from '../components/dashboard/Dashboard';

describe('<App/>', () => {

    let component: ReactWrapper<App, {}>;

    beforeEach(() => {
        component = mount(
            <App/>,
            {
                context: {
                    muiTheme: getMuiTheme(),
                },
                childContextTypes: {
                    muiTheme: PropTypes.object.isRequired,
                }
            }
        );
    });

    it('renders without crashing', () => {
        expect(component).not.toBeNull();
    });

    it('AppBar is a child component', () => {
        expect(component.find(AppBar).length).toBe(1);
    });

    it('Dashboard is a child component', () => {
        expect(component.find(Dashboard).length).toBe(1);
    });
});
