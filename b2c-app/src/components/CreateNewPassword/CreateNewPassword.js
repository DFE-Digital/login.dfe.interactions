import React from 'react';

import components from '..';

class CreateNewPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newPassword: null,
            reenteredPassword: null,
            errors: {
                newPassword: {
                    text: 'Enter your password',
                    showSummaryText: false,
                    id: 'newPasswordCustom'
                },
                reenteredPassword: {
                    text: '',
                    showSummaryText: false,
                    id: 'reenteredPasswordCustom'
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.isValidPassword = this.isValidPassword.bind(this);

        //initialise visible errors in parent component
        if (this.props.initialiseParentErrors) {
            this.props.initialiseParentErrors(this.state.errors);
        }
    }

    handleChange(e) {
        e.preventDefault();

        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
            this.props.onChange({
                password: this.isValidPassword() ? this.state.newPassword : null
            });
        });
    }

    isValidPassword() {
        let isValid = true;
        let password = this.state.newPassword;
        let reenteredPassword = this.state.reenteredPassword;

        //build new error state with empty value for text
        const newErrorState = { ...this.state.errors }
        newErrorState.newPassword.text = '';
        newErrorState.reenteredPassword.text = '';
        //reset showSummary too
        newErrorState.newPassword.showSummaryText = false;
        newErrorState.reenteredPassword.showSummaryText = false;

        //now update values if invalid
        if (!password || password === '') {
            isValid = false;
            newErrorState.newPassword.text = 'Enter your password';
        }
        else if (password.length < 8 || password.length > 16) {
            isValid = false;
            newErrorState.newPassword.text = 'Enter a password between 8 and 16 characters';
            newErrorState.newPassword.showSummaryText = true;
        }
        //run validation as it has been set up in B2C (default values as suggested here: https://msdn.microsoft.com/en-us/library/azure/jj943764.aspx )
        // eslint-disable-next-line
        else if (!password.match(/^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]))([A-Za-z\d@#$%^&*\-_+=[\]{}|\\:',?\/`~"();!]|\.(?!@)){8,16}$/)) {
            isValid = false;
            newErrorState.newPassword.text = 'Invalid password';
            newErrorState.newPassword.showSummaryText = true;
        }
        else if (!reenteredPassword || reenteredPassword === '') {
            isValid = false;
            newErrorState.reenteredPassword.text = 'Re-enter your password';
        }

        else if (reenteredPassword !== '' && password !== reenteredPassword) {
            isValid = false;
            newErrorState.reenteredPassword.text = 'Your passwords do not match';
        }

        this.setState({ errors: newErrorState }, () => {
            //call parent to update its state
            this.props.updateParentErrors(this.state.errors);
        });

        return isValid;
    }

    render() {

        const { visibleErrors, showErrors } = this.props;

        let newPasswordErrorElement;
        if (showErrors && visibleErrors.newPassword.text.length > 0) {
            newPasswordErrorElement =
                <span id="newPasswordError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {visibleErrors.newPassword.text}
                </span>
        }

        let reenteredPasswordErrorElement;
        if (showErrors && visibleErrors.reenteredPassword.text.length > 0)
            reenteredPasswordErrorElement =
                <span id="reenteredPasswordError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {visibleErrors.reenteredPassword.text}
                </span>

        return (

            <div>
                <div className={`govuk-form-group ${showErrors && visibleErrors.newPassword.text.length > 0 ? "govuk-form-group--error" : ""}`}>
                    <label className="govuk-label" htmlFor="newPasswordCustom">
                        Create new password
                    </label>
                    {newPasswordErrorElement}
                    <input className="govuk-input govuk-!-width-one-half" id="newPasswordCustom" name="newPassword" type="password" onChange={this.handleChange} noValidate />
                </div>

                <div className="govuk-form-group">
                    <components.PasswordHelpContainer />
                </div>

                <div className={`govuk-form-group ${showErrors && visibleErrors.reenteredPassword.text.length > 0 ? "govuk-form-group--error" : ""}`}>
                    <label className="govuk-label" htmlFor="reenteredPasswordCustom">
                        Re-type password
                    </label>
                    {reenteredPasswordErrorElement}
                    <input className="govuk-input govuk-!-width-one-half" id="reenteredPasswordCustom" name="reenteredPassword" type="password" onChange={this.handleChange} noValidate />
                </div>
            </div>

        )
    }
}

export default CreateNewPassword;