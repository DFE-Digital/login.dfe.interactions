import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { POLICIES } from '../constants/policies';

import ExpiredLink from './ExpiredLink';

it('renders without crashing', () => {
    shallow(<ExpiredLink />);
});

it('renders correctly without policy passed in', () => {
    const tree = renderer
        .create(<ExpiredLink />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with policy POLICIES.RESET_PASSWORD passed in', () => {
    const tree = renderer
        .create(<ExpiredLink policy={POLICIES.PASSWORD_RESET} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});