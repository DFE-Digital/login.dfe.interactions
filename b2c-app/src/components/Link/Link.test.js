import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { LINK_TYPES } from '../../constants/linkTypes';
import { create, act } from 'react-test-renderer';

import components from '..';


it('renders without crashing', () => {
    shallow(<components.Link />);
});

describe('when URL passed in as prop', () => {

    it('renders correctly without specified type', () => {
        let tree;
        act(() => {
            tree = create(<components.Link url='https://test.com' />)
        });
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders correctly link of type button', () => {
        let tree;
        act(() => {
            tree = create(<components.Link type={LINK_TYPES.BUTTON} url='https://test.com' />)
        });
        expect(tree.toJSON()).toMatchSnapshot();
    });
});

describe('when URL is not specified', () => {

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
});