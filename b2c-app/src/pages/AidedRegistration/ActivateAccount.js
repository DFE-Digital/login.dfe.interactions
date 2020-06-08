import React from 'react';
import components from '../../components';
import { onChange, onError } from '../../helpers/pageUpdatesHandler';

class ActivateAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: null,
            day: null,
            month: null,
            year: null,
            tsAndCsAccepted: false,
            showErrors: false,
            errors: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onError = onError.bind(this);
        this.onChange = onChange.bind(this);
    }

    componentDidMount() {
        document.getElementById('api').style.display = 'none';
        document.title = 'Activate your account | National Careers Service';
    }

    handleSubmit(e) {
        e.preventDefault();
        //update error messages
        this.state.errors.forEach((error) => {
            error.visible.text = error.current.text;
            error.visible.showSummaryText = error.current.showSummaryText;
        });
        //do something to validate and decide if we submit or show errors
        if (this.state.password &&
            this.state.day &&
            this.state.month &&
            this.state.year &&
            this.state.tsAndCsAccepted) {
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
        let b2cDobDay = document.getElementById('day');
        let b2cDobMonth = document.getElementById('month');
        let b2cDobYear = document.getElementById('year');
        let b2cTermsAndConditions = document.getElementById('tncCheckbox_true');
        let b2cSubmitButton = document.getElementById('continue');

        if (b2cPassword && b2cReenteredPassword &&
            b2cDobYear && b2cDobMonth && b2cDobYear &&
            b2cTermsAndConditions &&
            b2cSubmitButton) {
            b2cPassword.value = this.state.password;
            b2cReenteredPassword.value = this.state.password;
            b2cDobDay.value = this.state.day;
            b2cDobMonth.value = this.state.month;
            b2cDobYear.value = this.state.year;
            b2cTermsAndConditions.checked = this.state.tsAndCsAccepted;
            //submit B2C form
            b2cSubmitButton.click();
        }
    }

    render() {

        return (
            <div id="activateAccount">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    <components.PageLevelErrorContainer errorItems={this.state.errors} summaryTextContent={<components.PasswordHelp />} />

                    <main className="govuk-main-wrapper">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <components.PageTitle size='xl' title="Activate your account" />

                                <form id="activateAccountForm" onSubmit={this.handleSubmit} noValidate>
                                    <components.CreateNewPassword onChange={this.onChange} onError={this.onError} showErrors={this.state.showErrors} />
                                    <components.Paragraph text='As an extra security check, enter your date of birth.' />
                                    <components.DateOfBirth onChange={this.onChange} onError={this.onError} showErrors={this.state.showErrors} />
                                    <components.TermsAndConditions onChange={this.onChange} onError={this.onError} showErrors={this.state.showErrors} />
                                    <button className="govuk-button" id="preSubmit" type="submit">Activate account</button>
                                </form>
                            </div>
                        </div>
                    </main>

                </div>

            </div>
        )
    }
}

export default ActivateAccount;