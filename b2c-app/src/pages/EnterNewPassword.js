import React from 'react';
import components from '../components';

class EnterNewPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: null,
            showErrors: false,
            errors: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        //update error messages
        this.state.errors.forEach((error) => {
            error.visible.text = error.current.text;
            error.visible.showSummaryText = error.current.showSummaryText;
        });
        //do something to validate and decide if we submit or show errors
        if (this.state.password) {
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
        let b2cPassword = document.getElementById('newPassword');
        let b2cReenteredPassword = document.getElementById('reenterPassword');
        let b2cSubmitButton = document.getElementById('continue');

        if (b2cPassword && b2cReenteredPassword &&
            b2cSubmitButton) {
            b2cPassword.value = this.state.password;
            b2cReenteredPassword.value = this.state.password;
            //submit B2C form
            b2cSubmitButton.click();
        }
    }

    render() {

        const formContent = <components.CreateNewPassword showErrors={this.state.showErrors} errors={this.state.errors} />;

        return (
            <div id="enterNewPassword">
                <components.PageContainer
                    pageTitle='Reset your password'
                    formContent={formContent}
                    submitButtonText='Reset password'
                    submitHandler={this.handleSubmit}
                    errors={this.state.errors}
                    errorSummaryContent={<components.PasswordHelp />}
                />
            </div>
        )
    }
}

export default EnterNewPassword;