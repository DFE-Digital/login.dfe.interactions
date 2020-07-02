import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.Spinner />);
});

it('renders correctly with default text', () => {
    const tree = renderer
        .create(<components.Spinner showSpinner={true} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with custom text', () => {
    const tree = renderer
        .create(<components.Spinner text='custom spinner text' showSpinner={true}></components.Spinner>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

describe('when B2C is showing or hiding its own spinner', () => {

    it('sets the value of showB2CSpinner in the state in the mutation callback', () => {

        //prepare mutation data to simulate showing/hiding B2C spinner
        const b2cSpinnerNode = {
            id: 'simplemodal-overlay'
        };

        //set mutation list to simulate B2C adding its own spinner
        const addSpinnerMutations = [
            {
                addedNodes: [b2cSpinnerNode],
                removedNodes: []
            }
        ];
        const addSpinnerMutationList = addSpinnerMutations[Symbol.iterator]();

        //set mutation list to simulate B2C removing its own spinner
        const removeSpinnerMutations = [
            {
                addedNodes: [],
                removedNodes: [b2cSpinnerNode]
            }
        ];
        const removeSpinnerMutationList = removeSpinnerMutations[Symbol.iterator]();

        //Mount spinner
        const wrapper = mount(<components.Spinner />);

        //spinner not visible initially
        expect(wrapper.state().showB2CSpinner).toBe(false);

        //call mutation callback
        wrapper.instance().b2cSpinnerCallback(addSpinnerMutationList);
        //check showB2CSpinner is set to true
        expect(wrapper.state().showB2CSpinner).toBe(true);

        //call mutation callback
        wrapper.instance().b2cSpinnerCallback(removeSpinnerMutationList);
        //check showB2CSpinner is set back to false
        expect(wrapper.state().showB2CSpinner).toBe(false);
    });

    it('shows our spinner while showB2CSpinner is true', () => {
        const tree = renderer.create(<components.Spinner />);

        //spinner not visible
        expect(tree.toJSON()).toMatchSnapshot();

        tree.root.instance.setState({ showB2CSpinner: true });
        //spinner visible because B2C is showing its own spinner
        expect(tree.toJSON()).toMatchSnapshot();

        tree.root.instance.setState({ showB2CSpinner: false });
        //spinner not visible again because B2C has removed its own spinner
        expect(tree.toJSON()).toMatchSnapshot();
    });
});