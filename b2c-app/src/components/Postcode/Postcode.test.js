import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

const testErrors = {
    postcode: {
        text: 'this is a test'
    }
};
const updateParentMock = jest.fn();

it('renders without crashing', () => {
    shallow(<components.Postcode />);
});

it('renders correctly without props passed in', () => {
    const tree = renderer
        .create(<components.Postcode />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with errors', () => {
    const tree = renderer.create(
        <components.Postcode showErrors={true} visibleErrors={testErrors} />);

    expect(tree.toJSON()).toMatchSnapshot()
});

it('calls validation, sets errors and calls onChange callback', () => {

    const mockOnChangeCallback = jest.fn();

    const wrapper = mount(
        <components.Postcode
            showErrors={true}
            onChange={mockOnChangeCallback}
            visibleErrors={testErrors}
            updateParentErrors={updateParentMock} />
    );

    const postcodeInput = wrapper.find('#postcodeCustom');
    const validationSpy = jest.spyOn(wrapper.instance(), 'isValidPostcode');
    let changeEvent = {
        target:
        {
            name: 'postcode',
            value: 'RG02 1AB'
        }
    };

    //default values set
    expect(wrapper.state().postcode).toBe(null);
    expect(wrapper.state().errors.postcode.text).toEqual('Enter your postcode');

    //simulate entering valid postcode
    postcodeInput.simulate('change', changeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().postcode).toEqual('RG02 1AB');
    //check error message is empty
    expect(wrapper.state().errors.postcode.text).toEqual('');
    //onChange callback function passed in has been called with the valid value
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ postcode: 'RG02 1AB' });

    //simulate entering valid postcode without space
    changeEvent.target.value = 'RG021AB';
    postcodeInput.simulate('change', changeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated and the space is added to the postcode
    expect(wrapper.state().postcode).toEqual('RG02 1AB');
    //check error message is empty
    expect(wrapper.state().errors.postcode.text).toEqual('');
    //onChange callback function passed in has been called with the valid value
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ postcode: 'RG02 1AB' });

    //simulate entering invalid postcode (no space in it should make it fail validation)
    changeEvent.target.value = 'invalid';
    postcodeInput.simulate('change', changeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().postcode).toEqual('invalid');
    //onChange callback function passed in has been called with null
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ postcode: null });
    //check error message is set
    expect(wrapper.state().errors.postcode.text).toEqual('Enter a valid postcode');

    //simulate entering empty postcode
    changeEvent.target.value = '';
    postcodeInput.simulate('change', changeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().postcode).toEqual('');
    //onChange callback function passed in has been called with null
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ postcode: null });
    //check error message is set
    expect(wrapper.state().errors.postcode.text).toEqual('Enter your postcode');

});