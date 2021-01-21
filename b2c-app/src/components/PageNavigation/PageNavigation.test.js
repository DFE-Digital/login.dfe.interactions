import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

import headerData from '../../data/headerData.json';
const headerItems = headerData.navigationItems;

it('renders without crashing', () => {
    shallow(
        <components.PageNavigation />);
});

it('renders correctly with menu collapsed', () => {
    const tree = renderer
        .create(
            <components.PageNavigation expanded={false}>
                {headerItems}
            </components.PageNavigation>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with menu expanded', () => {
    const tree = renderer
        .create(
            <components.PageNavigation expanded={true}>
                {headerItems}
            </components.PageNavigation>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});