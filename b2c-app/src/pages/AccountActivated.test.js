import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import AccountActivated from './AccountActivated';

it('renders without crashing', () => {
    shallow(<AccountActivated />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<AccountActivated />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});