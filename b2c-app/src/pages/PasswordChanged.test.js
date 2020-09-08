
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import PasswordChanged from './PasswordChanged';

it('renders without crashing', () => {
    shallow(<PasswordChanged />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<PasswordChanged />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});