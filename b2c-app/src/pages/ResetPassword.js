import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';
import { onChange, onError } from '../helpers/pageUpdatesHandler';

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            showErrors: false,
            errors: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onError = onError.bind(this);
        this.onChange = onChange.bind(this);
    }

    componentDidMount() {
        document.getElementById('api').style.display = 'none';
        document.title = 'Access your account | National Careers Service';
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

        return (
            <div id="resetPassword">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    <components.PageLevelErrorContainer errorItems={this.state.errors} />

                    <main className="govuk-main-wrapper">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <components.PageTitle size='xl' title="Access your account" />
                                <components.Paragraph text="You can reset your password if you've forgotten it." />
                                <components.Paragraph text="If you cannot remember your email address you can also retrieve it here." />
                                <h3 className="govuk-heading-m">Reset your password</h3>
                                <components.Paragraph text="To reset your password we need to send an email to the address registered to your account." />

                                <form id="resetPasswordForm" onSubmit={this.handleSubmit} noValidate>
                                    <components.InputField
                                        type='email'
                                        inputId='email'
                                        inputLabel='Email address'
                                        errorMessagePlaceholder='email address'
                                        onChange={this.onChange}
                                        onError={this.onError}
                                        showErrors={this.state.showErrors}
                                    />
                                    <button className="govuk-button" id="preSubmit" type="submit">Send email</button>
                                </form>
                                <components.Paragraph text={cannotRememberEmailLink} />
                            </div>
                        </div>
                    </main>

                </div>

            </div>
        )
    }
}

export default ResetPassword;
