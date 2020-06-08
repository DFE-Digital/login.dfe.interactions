import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';
import { onChange, onError } from '../helpers/pageUpdatesHandler';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            showErrors: false,
            errors: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onError = onError.bind(this);
        this.onChange = onChange.bind(this);
    }

    componentDidMount() {
        document.getElementById('api').style.display = 'none';
        document.title = 'Sign in to your account | National Careers Service';
    }

    handleSubmit(e) {
        e.preventDefault();
        //update error messages
        this.state.errors.forEach((error) => {
            error.visible.text = error.current.text;
            error.visible.showSummaryText = error.current.showSummaryText;
        });
        //do something to validate and decide if we submit or show errors
        if (this.state.email &&
            this.state.password) {
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
        let b2cPassword = document.getElementById('password');
        let b2cSubmitButton = document.getElementById('next');

        if (b2cEmail && b2cPassword && b2cSubmitButton) {
            b2cEmail.value = this.state.email;
            b2cPassword.value = this.state.password;
            //submit B2C form
            b2cSubmitButton.click();
        }
    }

    render() {

        const cannotAccessAccountLink = <components.Link action={ACTIONS.RESET_PASSWORD} text="I cannot access my account" key="resetPassword" />;

        const createNewAccountParagraph = [
            <components.Link action={ACTIONS.SIGNUP} text="Creating an account" key="signup" />,
            " allows you to access and save your skills health check reports."
        ];

        return (

            <div id="login">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    <components.PageLevelErrorContainer errorItems={this.state.errors} />

                    <div className="govuk-width-container ">
                        <main className="govuk-main-wrapper " id="main-content" role="main">
                            <div className="govuk-grid-row">

                                <div className="govuk-grid-column-one-half">
                                    <components.PageTitle size='l' title='Sign in' />

                                    <form id="loginForm" onSubmit={this.handleSubmit} noValidate>
                                        <components.InputField
                                            type='email'
                                            inputId='email'
                                            inputLabel='Email address'
                                            errorMessagePlaceholder='email address'
                                            onChange={this.onChange}
                                            onError={this.onError}
                                            showErrors={this.state.showErrors}
                                        />
                                        <components.InputField
                                            type='password'
                                            inputId='password'
                                            inputLabel='Password'
                                            errorMessagePlaceholder='password'
                                            onChange={this.onChange}
                                            onError={this.onError}
                                            showErrors={this.state.showErrors}
                                        />
                                        <components.Paragraph text={cannotAccessAccountLink} />
                                        <button className="govuk-button" id="preSubmit" type="submit">Sign in</button>
                                    </form>
                                </div>

                                <div className="govuk-grid-column-one-half">
                                    <components.PageTitle size='l' title='Create an account' />
                                    <components.Paragraph text={createNewAccountParagraph} />
                                </div>

                            </div>
                        </main>
                    </div>

                </div>

            </div>
        )
    }
}

export default Login;
