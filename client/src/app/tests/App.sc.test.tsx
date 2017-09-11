import * as React from 'react';
import { mount } from 'enzyme';
import 'jest-styled-components';
import Div from '../App.sc';

describe('<Div/>', () => {
    it('app styled div snapshot', () => {
        expect(mount(<Div/>)).toMatchSnapshot();
    });
});
