import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import AccountNotFound from './AccountNotFound';

it('renders without crashing', () => {
    shallow(<AccountNotFound />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<AccountNotFound />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});