import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import AccountFound from './AccountFound';

it('renders without crashing', () => {
    shallow(<AccountFound />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<AccountFound />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});