import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import ExpiredLink from './ExpiredLink';

it('renders without crashing', () => {
    shallow(<ExpiredLink />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<ExpiredLink />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});