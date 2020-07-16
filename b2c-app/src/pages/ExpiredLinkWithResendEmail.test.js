
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import ExpiredLinkWithResendEmail from './ExpiredLinkWithResendEmail';

it('renders without crashing', () => {
    shallow(<ExpiredLinkWithResendEmail />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<ExpiredLinkWithResendEmail />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});