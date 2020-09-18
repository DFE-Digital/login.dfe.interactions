import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.DateOfBirth />);
});

it('renders correctly without props passed in', () => {
    const tree = renderer
        .create(<components.DateOfBirth />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with errors', () => {
    const tree = renderer.create(<components.DateOfBirth showErrors={true} />);
    tree.root.instance.setState({
        errors: {
            dob: {
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

    const wrapper = mount(<components.DateOfBirth showErrors={true} onChange={mockOnChangeCallback} />);
    const dayInput = wrapper.find('#dobDay');
    const monthInput = wrapper.find('#dobMonth');
    const yearInput = wrapper.find('#dobYear');

    const validationSpy = jest.spyOn(wrapper.instance(), 'isValidDob');

    const testDay = '10';
    const testMonth = '11';
    const testYear = '2000';

    let dayChangeEvent = {
        target:
        {
            name: 'dobDay',
            value: testDay
        }
    };
    let monthChangeEvent = {
        target:
        {
            name: 'dobMonth',
            value: testMonth
        }
    };
    let yearChangeEvent = {
        target:
        {
            name: 'dobYear',
            value: testYear
        }
    };

    //default values set
    expect(wrapper.state().dobDay).toBe(null);
    expect(wrapper.state().dobMonth).toBe(null);
    expect(wrapper.state().dobYear).toBe(null);
    expect(wrapper.state().errors.dob.current.text).toEqual('Enter date of birth');

    //simulate entering day
    dayInput.simulate('change', dayChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().dobDay).toEqual(testDay);
    //check error message is set as date is still not complete
    expect(wrapper.state().errors.dob.current.text).toEqual('Enter a valid date of birth');
    //onChange callback function passed in has been called with null
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ dob: null });

    //simulate entering month
    monthInput.simulate('change', monthChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().dobMonth).toEqual(testMonth);
    //check error message is set as date is still not complete
    expect(wrapper.state().errors.dob.current.text).toEqual('Enter a valid date of birth');
    //onChange callback function passed in has been called with null
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ dob: null });

    //simulate entering year
    yearInput.simulate('change', yearChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().dobYear).toEqual(testYear);
    //check error message is cleared as date is valid
    expect(wrapper.state().errors.dob.current.text).toEqual('');
    //onChange callback function passed in has been called with date object
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ dob: new Date(testYear, testMonth - 1, testDay) });

    //simulate entering year that means age is below 13
    yearChangeEvent.target.value = '2019';
    yearInput.simulate('change', yearChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().dobYear).toEqual('2019');
    //check error message is set as date is still not complete
    expect(wrapper.state().errors.dob.current.text).toEqual('Enter a valid date of birth');
    //onChange callback function passed in has been called with null
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ dob: null });

    //simulate entering year that means age is above 65
    yearChangeEvent.target.value = '1950';
    yearInput.simulate('change', yearChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().dobYear).toEqual('1950');
    //check error message is set as date is still not complete
    expect(wrapper.state().errors.dob.current.text).toEqual('Enter a valid date of birth');
    //onChange callback function passed in has been called with null
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ dob: null });

    //simulate deleting part of the year
    yearChangeEvent.target.value = '200';
    yearInput.simulate('change', yearChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state value has been updated
    expect(wrapper.state().dobYear).toEqual('200');
    //check error message is set as date is still not complete
    expect(wrapper.state().errors.dob.current.text).toEqual('Enter a valid date of birth');
    //onChange callback function passed in has been called with null
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ dob: null });

    //simulate clearing all values
    dayChangeEvent.target.value = '';
    dayInput.simulate('change', dayChangeEvent);
    monthChangeEvent.target.value = '';
    monthInput.simulate('change', monthChangeEvent);
    yearChangeEvent.target.value = '';
    yearInput.simulate('change', yearChangeEvent);
    //validation called
    expect(validationSpy).toHaveBeenCalled();
    //state values have been updated
    expect(wrapper.state().dobDay).toEqual('');
    expect(wrapper.state().dobMonth).toEqual('');
    expect(wrapper.state().dobYear).toEqual('');
    //check error message is set as date is still not complete
    expect(wrapper.state().errors.dob.current.text).toEqual('Enter date of birth');
    //onChange callback function passed in has been called with null
    expect(mockOnChangeCallback).toHaveBeenCalledWith({ dob: null });

});