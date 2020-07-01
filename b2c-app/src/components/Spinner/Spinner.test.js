import React from 'react';
import { shallow } from 'enzyme';
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

it('is shown while B2C shows its spinner', () => {
    const tree = renderer.create(<components.Spinner />);

    //spinner not visible
    expect(tree.toJSON()).toMatchSnapshot();

    tree.root.instance.setState({ showB2CSpinner: true });
    //spinner visible because B2C is showing its own spinner
    expect(tree.toJSON()).toMatchSnapshot();

    tree.root.instance.setState({ showB2CSpinner: false });
    //spinner not visible again because B2C has removed its own spinner
    expect(tree.toJSON()).toMatchSnapshot();


    //TODO ver si esto lo puedo hacer usando el mutation observer de verdad y no solo cambiando el estado


});