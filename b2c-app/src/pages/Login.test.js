
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Login from './Login';

it('renders without crashing', () => {
    shallow(<Login />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<Login />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});