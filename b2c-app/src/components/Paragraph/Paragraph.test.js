import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.Paragraph />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(
            <components.Paragraph>
                this is a test
                <a>with a link in it</a>
            </components.Paragraph>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});