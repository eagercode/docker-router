import * as React from 'react';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { getMuiTheme } from 'material-ui/styles';
import 'jest-styled-components';
import App from '../App';
import Div from '../App.sc';

describe('<App/>', () => {

    it('App snapshot', () => {
        const component: ShallowWrapper<App, {}> = shallow(
            <App/>,
            {
                context: {
                    muiTheme: getMuiTheme(),
                }
            }
        );

        expect(component).toMatchSnapshot();
    });

    it('App styled div snapshot', () => {
        expect(mount(<Div/>)).toMatchSnapshot();
    });
});
