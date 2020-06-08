import React from 'react';
import components from '../components';
import { onChange, onError } from '../helpers/pageUpdatesHandler';

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
            errors: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onError = onError.bind(this);
        this.onChange = onChange.bind(this);
    }

    componentDidMount() {
        document.getElementById('api').style.display = 'none';
        document.title = 'Find your email address | National Careers Service';
    }

    handleSubmit(e) {
        e.preventDefault();
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
        return (
            <div id="forgottenEmail">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    <components.PageLevelErrorContainer errorItems={this.state.errors} />

                    <main className="govuk-main-wrapper">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <components.PageTitle size='xl' title="Find your email address" />

                                <form id="activateAccountForm" onSubmit={this.handleSubmit} noValidate>
                                    <components.InputField
                                        inputId='firstName'
                                        inputLabel='First name'
                                        errorMessagePlaceholder='first name'
                                        onChange={this.onChange}
                                        onError={this.onError}
                                        showErrors={this.state.showErrors}
                                    />
                                    <components.InputField
                                        inputId='lastName'
                                        inputLabel='Last name'
                                        errorMessagePlaceholder='last name'
                                        onChange={this.onChange}
                                        onError={this.onError}
                                        showErrors={this.state.showErrors}
                                    />
                                    <components.DateOfBirth onChange={this.onChange} onError={this.onError} showErrors={this.state.showErrors} />
                                    <components.Postcode onChange={this.onChange} onError={this.onError} showErrors={this.state.showErrors} />
                                    <button className="govuk-button" id="preSubmit" type="submit">Find email address</button>
                                </form>
                            </div>
                        </div>
                    </main>

                </div>

            </div>
        )
    }
}

export default ForgottenEmail;
