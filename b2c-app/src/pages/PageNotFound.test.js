import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import PageNotFound from './PageNotFound';

it('renders without crashing', () => {
    shallow(<PageNotFound />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<PageNotFound />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});