import React from 'react';
import { animateScroll } from "react-scroll";

import components from '../components';
import { onChange } from '../helpers/pageUpdatesHandler';

class ResendActivationEmail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
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
            error.visible.showSummaryText = true;
        });
        //do something to validate and decide if we submit or show errors
        if (this.state.email) {
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
        let b2cEmail = document.getElementById('email');
        let b2cSubmitButton = document.getElementById('continue');

        if (b2cEmail && b2cSubmitButton) {
            b2cEmail.value = this.state.email;
            //submit B2C form
            b2cSubmitButton.click();
        }
    }

    render() {

        const formContent =
            <div>
                <components.InputField
                    type='email'
                    inputId='email'
                    inputLabel='Email address'
                    onChange={this.onChange}
                    errorMessagePlaceholder='email address'
                    showErrors={this.state.showErrors}
                    errors={this.state.errors} />
            </div>

        /**
         * Page configuration
         */
        const title = 'Resend activation email'
        const pageConfig = {
            title: title,
            header: title,
            formContent: formContent,
            submitButtonText: 'Send activation email',
            submitHandler: this.handleSubmit,
            errors: this.state.errors,
            showB2CErrors: this.state.showB2CErrors
        };


        return (
            <div id="resendActivationEmail">
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default ResendActivationEmail;
