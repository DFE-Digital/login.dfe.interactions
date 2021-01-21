import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.PageTitle />);
});

it('renders correctly with unspecified size', () => {
    const tree = renderer
        .create(<components.PageTitle />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly on extra-large size', () => {
    const tree = renderer
        .create(<components.PageTitle size='xl' />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});