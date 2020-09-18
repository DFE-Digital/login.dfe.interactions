import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.CreateNewPassword />);
});

it('renders correctly without props passed in', () => {
    const tree = renderer
        .create(<components.CreateNewPassword />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with errors', () => {
    const tree = renderer.create(<components.CreateNewPassword showErrors={true} />);
    tree.root.instance.setState({
        errors: {
            newPassword: {
                visible: {
                    text: 'this is a test'
                }
            },
            reenteredPassword: {
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

    const wrapper = mount(<components.CreateNewPassword showErrors={true} onChange={mockOnChangeCallback} />);
    const newPasswordInput = wrapper.find('#newPasswordCustom');
    const reenteredPasswordInput = wrapper.find('#reenteredPasswordCustom');
    const validationSpy = jest.spyOn(wrapper.instance(), 'isValidPassword');

    const validPassword = 'aaaaaa1!';
    const invalidPassword = 'aaaaaaaaa';
    const shortPassword = 'a';
    let newPasswordChangeEvent = {
        target:
        {
            name: 'newPassword',
            value: shortPassword
        }
    };
    let reenteredPasswordChangeEvent = {
        target:
        {
            name: 'reenteredPassword',
            value: validPassword
        }
    };

    //default values set
    expect(wrapper.state().newPassword).toBe(null);
    expect(wrapper.state().reenteredPassword).toBe(null);
    expect(wrapper.state().errors.newPassword.current.text).toEqual('Enter your password');
    expect(wrapper.state().errors.reenteredPassword.current.text).toEqual('');

    //simulate entering a password too short
    newPasswordInput.simulate('change', newPasswordChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().newPassword).toEqual(shortPassword);
    //check error message is set because reentered password is still not set
    expect(wrapper.state().errors.newPassword.current.text).toEqual('Enter a password between 8 and 16 characters');
    expect(wrapper.state().errors.reenteredPassword.current.text).toEqual('');
    //onChange callback function passed in has been called with the valid value
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ password: null });

    //simulate entering a password that doesn't meet requirements
    newPasswordChangeEvent.target.value = invalidPassword;
    newPasswordInput.simulate('change', newPasswordChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().newPassword).toEqual(invalidPassword);
    //check error message is set because reentered password is still not set
    expect(wrapper.state().errors.newPassword.current.text).toEqual('Invalid password');
    expect(wrapper.state().errors.reenteredPassword.current.text).toEqual('');
    //onChange callback function passed in has been called with the valid value
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ password: null });

    //simulate entering valid password (but not reentered password yet)
    newPasswordChangeEvent.target.value = validPassword;
    newPasswordInput.simulate('change', newPasswordChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().newPassword).toEqual(validPassword);
    //check error message is set because reentered password is still not set
    expect(wrapper.state().errors.newPassword.current.text).toEqual('');
    expect(wrapper.state().errors.reenteredPassword.current.text).toEqual('Re-enter your password');
    //onChange callback function passed in has been called with the valid value
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ password: null });

    //simulate entering reentered password
    reenteredPasswordInput.simulate('change', reenteredPasswordChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().reenteredPassword).toEqual(validPassword);
    //check error messages are cleared
    expect(wrapper.state().errors.newPassword.current.text).toEqual('');
    expect(wrapper.state().errors.reenteredPassword.current.text).toEqual('');
    //onChange callback function passed in has been called with the valid value
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ password: validPassword });

    //simulate entering different password values
    reenteredPasswordChangeEvent.target.value = 'something';
    reenteredPasswordInput.simulate('change', reenteredPasswordChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().reenteredPassword).toEqual('something');
    //check error message is set
    expect(wrapper.state().errors.newPassword.current.text).toEqual('');
    expect(wrapper.state().errors.reenteredPassword.current.text).toEqual('Your passwords do not match');
    //onChange callback function passed in has been called with null
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ password: null });

});