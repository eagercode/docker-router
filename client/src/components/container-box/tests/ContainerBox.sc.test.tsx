import * as React from 'react';
import { mount } from 'enzyme';
import 'jest-styled-components';
import Div from '../ContainerBox.sc';

describe('<Div/>', () => {
    it('container box styled div snapshot', () => {
        expect(mount(<Div/>)).toMatchSnapshot();
    });
});
