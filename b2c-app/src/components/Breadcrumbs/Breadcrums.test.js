import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.Breadcrumbs />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<components.Breadcrumbs />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});