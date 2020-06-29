import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.Header />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<components.Header />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('should change state to expand menu when clicking menuToggle', () => {
    const wrapper = mount(<components.Header />);
    expect(wrapper.state().menuExpanded).toBe(false);
    wrapper.find('#menuToggle').simulate('click');
    expect(wrapper.state().menuExpanded).toBe(true);
});