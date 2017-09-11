import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { getMuiTheme } from 'material-ui/styles';
import App from '../App';

describe('<App/>', () => {
    it('app snapshot', () => {
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
});
