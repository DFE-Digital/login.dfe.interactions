import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.HeaderTitle />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<components.HeaderTitle title='this is a test' />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});