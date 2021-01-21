import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.MenuToggle />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<components.MenuToggle>text</components.MenuToggle>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});