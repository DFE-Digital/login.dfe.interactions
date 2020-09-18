import React from 'react';
import { animateScroll } from "react-scroll";

import components from '../components';
import { onChange } from '../helpers/pageUpdatesHandler';
import { PAGE_IDS } from '../constants/pageIds';

class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            tsAndCsAccepted: false,
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
            this.state.email &&
            this.state.password &&
            this.state.tsAndCsAccepted) {
            //hide our validation errors and prepare to show B2C ones (in case there are any)
            this.setState({ showErrors: false, showB2CErrors: true });
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
        let b2cPassword = document.getElementById('newPassword');
        let b2cReenteredPassword = document.getElementById('reenterPassword');
        let b2cEmail = document.getElementById('email');
        let b2cTermsAndConditions = document.getElementById('tncCheckbox_true');
        let b2cSubmitButton = document.getElementById('continue');

        if (b2cFirstName && b2cLastName &&
            b2cPassword && b2cReenteredPassword &&
            b2cEmail &&
            b2cTermsAndConditions &&
            b2cSubmitButton) {
            b2cFirstName.value = this.state.firstName;
            b2cLastName.value = this.state.lastName;
            b2cPassword.value = this.state.password;
            b2cReenteredPassword.value = this.state.password;
            b2cEmail.value = this.state.email;
            b2cTermsAndConditions.checked = this.state.tsAndCsAccepted;
            //submit B2C form
            b2cSubmitButton.click();
        }
    }

    render() {

        const formContent =
            <div>
                <components.InputField
                    inputId='firstName'
                    inputLabel='First name'
                    onChange={this.onChange}
                    errorMessagePlaceholder='first name'
                    showErrors={this.state.showErrors}
                    errors={this.state.errors} />
                <components.InputField
                    inputId='lastName'
                    inputLabel='Last name'
                    onChange={this.onChange}
                    errorMessagePlaceholder='last name'
                    showErrors={this.state.showErrors}
                    errors={this.state.errors} />
                <components.InputField
                    type='email'
                    inputId='email'
                    inputLabel='Email address'
                    hint="You'll need this to sign in to your account"
                    onChange={this.onChange}
                    errorMessagePlaceholder='email address'
                    showErrors={this.state.showErrors}
                    errors={this.state.errors} />
                <components.CreateNewPassword
                    onChange={this.onChange}
                    showErrors={this.state.showErrors}
                    errors={this.state.errors} />
                <components.TermsAndConditions
                    onChange={this.onChange}
                    showErrors={this.state.showErrors}
                    errors={this.state.errors} />
            </div>

        const title = 'Create an account';

        const pageConfig = {
            title: title,
            header: title,
            formContent: formContent,
            submitButtonText: title,
            submitHandler: this.handleSubmit,
            errors: this.state.errors,
            showB2CErrors: this.state.showB2CErrors,
            errorSummaryContent: <components.PasswordHelp />
        };


        return (
            <div id={PAGE_IDS.SIGNUP}>
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default Signup;
