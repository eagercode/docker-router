import * as React from 'react';
import { mount } from 'enzyme';
import 'jest-styled-components';
import Div from '../Dashboard.sc';

describe('<Div/>', () => {
    it('styled dashboard div snapshot', () => {
        expect(mount(<Div/>)).toMatchSnapshot();
    })
});