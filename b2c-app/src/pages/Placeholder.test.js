
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Placeholder from './Placeholder';

it('renders without crashing', () => {
    shallow(<Placeholder />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<Placeholder />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});