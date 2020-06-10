import React from 'react';
import { animateScroll } from "react-scroll";

import components from '../components';
import { onChange } from '../helpers/pageUpdatesHandler';

class ForgottenEmail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: null,
            lastName: null,
            day: null,
            month: null,
            year: null,
            postcode: null,
            showErrors: false,
            showB2CErrors: true,
            errors: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = onChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        //hide B2C errors and only show again if we are going to submit the form to B2C
        this.setState({ showB2CErrors: false });
        //update error messages
        this.state.errors.forEach((error) => {
            error.visible.text = error.current.text;
            error.visible.showSummaryText = error.current.showSummaryText;
        });
        //do something to validate and decide if we submit or show errors
        if (this.state.firstName &&
            this.state.lastName &&
            this.state.day &&
            this.state.month &&
            this.state.year &&
            this.state.postcode) {
            //hide our validation errors and prepare to show B2C ones (in case there are any)
            this.setState({ showErrors: false });
            this.setState({ showB2CErrors: true });
            //everything is valid, set data and submit B2C form
            this.setDataAndSubmit();
        }
        else {
            //show errors in each component
            this.setState({ showErrors: true });
            //scroll to the top of the page to show the errors
            animateScroll.scrollToTop({ duration: 500 });
        }
    }

    setDataAndSubmit() {
        //retrieve all elements we will need and set their values
        let b2cFirstName = document.getElementById('givenName');
        let b2cLastName = document.getElementById('surname');
        let b2cDobDay = document.getElementById('day');
        let b2cDobMonth = document.getElementById('month');
        let b2cDobYear = document.getElementById('year');
        let b2cPostcode = document.getElementById('postCode');
        let b2cSubmitButton = document.getElementById('continue');

        if (b2cFirstName && b2cLastName &&
            b2cDobYear && b2cDobMonth && b2cDobYear &&
            b2cPostcode &&
            b2cSubmitButton) {
            b2cFirstName.value = this.state.firstName;
            b2cLastName.value = this.state.lastName;
            b2cDobDay.value = this.state.day;
            b2cDobMonth.value = this.state.month;
            b2cDobYear.value = this.state.year;
            b2cPostcode.value = this.state.postcode;
            //submit B2C form
            b2cSubmitButton.click();
        }
    }

    render() {

        const formContent = [
            <components.InputField
                inputId='firstName'
                inputLabel='First name'
                onChange={this.onChange}
                errorMessagePlaceholder='first name'
                showErrors={this.state.showErrors}
                errors={this.state.errors}
                key='inputName'
            />,
            <components.InputField
                inputId='lastName'
                inputLabel='Last name'
                onChange={this.onChange}
                errorMessagePlaceholder='last name'
                showErrors={this.state.showErrors}
                errors={this.state.errors}
                key='inputLastName'
            />,
            <components.DateOfBirth
                onChange={this.onChange}
                showErrors={this.state.showErrors}
                errors={this.state.errors}
                key='dob' />,
            <components.Postcode
                onChange={this.onChange}
                showErrors={this.state.showErrors}
                errors={this.state.errors}
                key='postcode' />
        ];

        return (
            <div id="forgottenEmail">
                <components.PageContainer
                    pageTitle='Find your email address'
                    formContent={formContent}
                    submitButtonText='Find email address'
                    submitHandler={this.handleSubmit}
                    errors={this.state.errors}
                    showB2CErrors={this.state.showB2CErrors}
                />
            </div>
        )
    }
}

export default ForgottenEmail;
