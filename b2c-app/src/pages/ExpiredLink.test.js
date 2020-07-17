import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { ACTIONS } from '../constants/actions';

import ExpiredLink from './ExpiredLink';

it('renders without crashing', () => {
    shallow(<ExpiredLink />);
});

it('renders correctly without action passed in', () => {
    const tree = renderer
        .create(<ExpiredLink />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with action ACTIONS.RESET_PASSWORD passed in', () => {
    const tree = renderer
        .create(<ExpiredLink action={ACTIONS.RESET_PASSWORD} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});