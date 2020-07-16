
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import ForgottenEmail from './ForgottenEmail';

it('renders without crashing', () => {
    shallow(<ForgottenEmail />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<ForgottenEmail />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});