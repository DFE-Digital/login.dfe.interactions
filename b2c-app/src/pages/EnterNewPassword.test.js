import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import EnterNewPassword from './EnterNewPassword';

it('renders without crashing', () => {
    shallow(<EnterNewPassword />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<EnterNewPassword />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});