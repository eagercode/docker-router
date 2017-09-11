import * as React from 'react';
import { mount } from 'enzyme';
import 'jest-styled-components';
import Indicator from '../Indicator';

describe('<Indicator/>', () => {
    it('active indicator snapshot', () => {
        expect(mount(<Indicator isActive={true}/>)).toMatchSnapshot();
    });

    it('inactive indicator snapshot', () => {
        expect(mount(<Indicator isActive={false}/>)).toMatchSnapshot();
    });
});