import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.FooterLink />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<components.FooterLink title='this is a test' />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});