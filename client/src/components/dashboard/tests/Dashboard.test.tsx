import * as React from 'react';
import { shallow } from 'enzyme';
import Dashboard from '../Dashboard';

describe('<Dashboard/>', () => {
    it('dashboard snapshot', () => {
        expect(shallow(<Dashboard/>)).toMatchSnapshot();
    });
});
