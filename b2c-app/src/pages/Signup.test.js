
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Signup from './Signup';

it('renders without crashing', () => {
    shallow(<Signup />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<Signup />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});