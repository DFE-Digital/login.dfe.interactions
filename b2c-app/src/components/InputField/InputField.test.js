import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

const inputId = 'testInput';

describe('when type is not specified', () => {

    it('renders without crashing', () => {
        shallow(<components.InputField />);
    });

    it('renders correctly without props passed in', () => {
        const tree = renderer
            .create(<components.InputField />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly with props passed in', () => {
        const tree = renderer
            .create(
                <components.InputField
                    inputId={inputId}
                    hint='test'
                />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly with errors', () => {
        const tree = renderer.create(<components.InputField inputId={inputId} showErrors={true} />);
        tree.root.instance.setState({
            errors: {
                postcode: {
                    visible: {
                        text: 'this is a test'
                    }
                }
            }
        });
        expect(tree.toJSON()).toMatchSnapshot()
    });

    it('calls validation, sets errors and calls onChange callback', () => {

        const mockOnChangeCallback = jest.fn();

        const wrapper = mount(
            <components.InputField
                inputId={inputId}
                showErrors={true}
                onChange={mockOnChangeCallback}
                errorMessagePlaceholder={inputId}
            />);
        const input = wrapper.find(`#${inputId}Custom`);
        const validationSpy = jest.spyOn(wrapper.instance(), 'isValidInput');
        let changeEvent = {
            target:
            {
                name: inputId,
                value: 'something'
            }
        };

        //default values set
        expect(wrapper.state()[inputId]).toBe(null);
        expect(wrapper.state().errors[inputId].current.text).toEqual(`Enter your ${inputId}`);

        //simulate entering value in input
        input.simulate('change', changeEvent);
        //validation called
        expect(validationSpy).toHaveBeenCalled();
        //state value has been updated
        expect(wrapper.state()[inputId]).toEqual('something');

        //check error message is empty
        expect(wrapper.state().errors[inputId].current.text).toEqual('');
        //onChange callback function passed in has been called with the valid value
        expect(mockOnChangeCallback).toHaveBeenCalledWith({ [inputId]: 'something' });

        //simulate entering empty value
        changeEvent.target.value = '';
        input.simulate('change', changeEvent);
        //validation called
        expect(validationSpy).toHaveBeenCalled();
        //state value has been updated
        expect(wrapper.state()[inputId]).toEqual('');
        //onChange callback function passed in has been called with null
        expect(mockOnChangeCallback).toHaveBeenCalledWith({ [inputId]: null });
        //check error message is set
        expect(wrapper.state().errors[inputId].current.text).toEqual(`Enter your ${inputId}`);

    });

});



describe('when type is email', () => {

    it('renders correctly with props passed in', () => {
        const tree = renderer
            .create(<components.InputField type='email' inputId={inputId} hint='test' />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('calls validation, sets errors and calls onChange callback', () => {

        const mockOnChangeCallback = jest.fn();

        const wrapper = mount(
            <components.InputField
                type='email'
                inputId={inputId}
                showErrors={true}
                onChange={mockOnChangeCallback}
                errorMessagePlaceholder={inputId}
            />);
        const input = wrapper.find(`#${inputId}Custom`);
        const validationSpy = jest.spyOn(wrapper.instance(), 'isValidInput');
        let changeEvent = {
            target:
            {
                name: inputId,
                value: 'something'
            }
        };

        //default values set
        expect(wrapper.state()[inputId]).toBe(null);
        expect(wrapper.state().errors[inputId].current.text).toEqual(`Enter your ${inputId}`);

        //simulate entering an invalid email in input
        input.simulate('change', changeEvent);
        //validation called
        expect(validationSpy).toHaveBeenCalled();
        //state value has been updated
        expect(wrapper.state()[inputId]).toEqual('something');

        //check error message is empty
        expect(wrapper.state().errors[inputId].current.text).toEqual(`Invalid ${inputId}`);
        //onChange callback function passed in has been called with the valid value
        expect(mockOnChangeCallback).toHaveBeenCalledWith({ [inputId]: null });

        //simulate entering empty value
        changeEvent.target.value = '';
        input.simulate('change', changeEvent);
        //validation called
        expect(validationSpy).toHaveBeenCalled();
        //state value has been updated
        expect(wrapper.state()[inputId]).toEqual('');
        //onChange callback function passed in has been called with null
        expect(mockOnChangeCallback).toHaveBeenCalledWith({ [inputId]: null });
        //check error message is set
        expect(wrapper.state().errors[inputId].current.text).toEqual(`Enter your ${inputId}`);

        //simulate entering a valid email
        changeEvent.target.value = 'someone@somewhere.com';
        input.simulate('change', changeEvent);
        //validation called
        expect(validationSpy).toHaveBeenCalled();
        //state value has been updated
        expect(wrapper.state()[inputId]).toEqual('someone@somewhere.com');
        //onChange callback function passed in has been called with null
        expect(mockOnChangeCallback).toHaveBeenCalledWith({ [inputId]: 'someone@somewhere.com' });
        //check error message is set
        expect(wrapper.state().errors[inputId].current.text).toEqual('');

    });

});