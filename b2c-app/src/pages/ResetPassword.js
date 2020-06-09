import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';
import { onChange } from '../helpers/pageUpdatesHandler';

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            showErrors: false,
            errors: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = onChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        //update error messages
        this.state.errors.forEach((error) => {
            error.visible.text = error.current.text;
            error.visible.showSummaryText = error.current.showSummaryText;
        });
        //do something to validate and decide if we submit or show errors
        if (this.state.email) {
            this.setState({ showErrors: false });
            //everything is valid, set data and submit B2C form
            this.setDataAndSubmit();
        }
        else {
            //show errors in each component
            this.setState({ showErrors: true });
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

        const cannotRememberEmailLink = <components.Link action={ACTIONS.FIND_EMAIL} text="Can't remember your email address?" key="forgotenEmail" />;

        const aboveFormContent = [
            <components.Paragraph text="You can reset your password if you've forgotten it." key='paragraph1' />,
            <components.Paragraph text="If you cannot remember your email address you can also retrieve it here." key='paragraph2' />,
            <h3 className="govuk-heading-m" key='heading'>Reset your password</h3>,
            <components.Paragraph text="To reset your password we need to send an email to the address registered to your account." key='paragraph3' />
        ];

        const formContent =
            <components.InputField
                type='email'
                inputId='email'
                inputLabel='Email address'
                onChange={this.onChange}
                errorMessagePlaceholder='email address'
                showErrors={this.state.showErrors}
                errors={this.state.errors}
            />;

        const belowFormContent = <components.Paragraph text={cannotRememberEmailLink} />;

        return (
            <div id="activateAccount">
                <components.PageContainer
                    pageTitle='Access your account'
                    aboveFormContent={aboveFormContent}
                    formContent={formContent}
                    belowFormContent={belowFormContent}
                    submitButtonText='Send email'
                    submitHandler={this.handleSubmit}
                    errors={this.state.errors}
                />
            </div>
        )
    }
}

export default ResetPassword;
