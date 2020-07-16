import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import ActivateAccount from './ActivateAccount';

it('renders without crashing', () => {
    shallow(<ActivateAccount />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<ActivateAccount />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});