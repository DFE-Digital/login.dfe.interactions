import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

import footerData from '../../data/footerData.json';
const footerItems = footerData.items;

it('renders without crashing', () => {
    shallow(<components.FooterNavigation items={footerItems} />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<components.FooterNavigation items={footerItems} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});