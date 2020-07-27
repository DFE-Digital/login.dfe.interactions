import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { LINK_TYPES } from '../../constants/linkTypes';

import components from '..';


it('renders without crashing', () => {
    shallow(<components.Link />);
});

it('renders correctly without specified type', () => {
    const tree = renderer
        .create(<components.Link />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly link of type button', () => {
    const tree = renderer
        .create(<components.Link type={LINK_TYPES.BUTTON} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});