import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.PasswordHelp />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<components.PasswordHelp />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});