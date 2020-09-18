import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.Footer />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<components.Footer />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});