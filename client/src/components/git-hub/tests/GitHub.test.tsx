import * as React from 'react';
import { mount } from 'enzyme';
import 'jest-styled-components';
import GitHub from '../GitHub';

describe('<GitHub/>', () => {
    it('GitHub snapshot', () => {
        expect(mount(<GitHub/>)).toMatchSnapshot();
    });
});
