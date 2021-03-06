import * as React from 'react';
import { getMuiTheme } from 'material-ui/styles';
import { shallow } from 'enzyme';
import ContainerBox from '../ContainerBox';
import Container from '../../../model/Container';

describe('<ContainerBox/>', () => {
    it('container box snapshot', () => {
        const container = new Container('2dcb8f1b0fec', 'dockerrouter_web', '"npm run start-dev..."', '36 seconds ago', 'Up 6 seconds', '0.0.0.0:80->80/tcp', 'dockerrouter_web_1', true);
        const component = shallow(
            <ContainerBox container={container}/>,
            {
                context: {
                    muiTheme: getMuiTheme(),
                }
            }
        );

        expect(component).toMatchSnapshot();
    });
});
