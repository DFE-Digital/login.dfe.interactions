import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

const testErrors = {
    tsAndCs: {
        text: 'this is a test'
    }
};
const updateParentMock = jest.fn();

it('renders without crashing', () => {
    shallow(<components.TermsAndConditions />);
});

it('renders correctly without props passed in', () => {
    const tree = renderer
        .create(<components.TermsAndConditions />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with errors', () => {
    const tree = renderer.create(<components.TermsAndConditions showErrors={true} visibleErrors={testErrors} />);
    tree.root.instance.setState({
        errors: {
            tsAndCs: {
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
        <components.TermsAndConditions
            showErrors={true}
            onChange={mockOnChangeCallback}
            visibleErrors={testErrors}
            updateParentErrors={updateParentMock} />
    );
    const tsAndCsCheckbox = wrapper.find('#tsAndCsCustom');
    const validationSpy = jest.spyOn(wrapper.instance(), 'isValidTsAndCs');
    let changeEvent = {
        target:
        {
            name: 'tsAndCsAccepted',
            checked: true
        }
    };


    //default values set
    expect(wrapper.state().tsAndCsAccepted).toBe(false);
    expect(wrapper.state().errors.tsAndCs.text).toEqual('You must accept our Terms and Conditions');

    //simulate checking Ts & Cs
    tsAndCsCheckbox.simulate('change', changeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().tsAndCsAccepted).toBe(true);
    //check error message is empty
    expect(wrapper.state().errors.tsAndCs.text).toEqual('');
    //callback function passed in has been called
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ tsAndCsAccepted: true });

    //simulate unchecking Ts & Cs
    changeEvent.target.checked = false;
    tsAndCsCheckbox.simulate('change', changeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().tsAndCsAccepted).toBe(false);
    //callback function passed in has been called
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ tsAndCsAccepted: false });
    //check error message is empty
    expect(wrapper.state().errors.tsAndCs.text).toEqual('You must accept our Terms and Conditions');

});