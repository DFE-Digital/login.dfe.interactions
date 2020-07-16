
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import ResetPassword from './ResetPassword';

it('renders without crashing', () => {
    shallow(<ResetPassword />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<ResetPassword />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});