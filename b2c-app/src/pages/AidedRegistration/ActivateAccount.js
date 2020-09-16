import React from 'react';
import { animateScroll } from "react-scroll";

import components from '../../components';

import { onChange } from '../../helpers/pageUpdatesHandler';
import {
    updateVisibleErrorsInState,
    initialiseErrorsInContainer,
    updateCurrentErrorsInState
} from '../../helpers/pageErrorHandler';

import { PAGE_IDS } from '../../constants/pageIds';

class ActivateAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: null,
            dob: null,
            tsAndCsAccepted: false,
            showErrors: false,
            showB2CErrors: true,
            childrenErrors: {},
            visibleErrors: {}
        }
        this.childrenErrors = {};
        this.visibleErrors = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = onChange.bind(this);
        this.updateVisibleErrorsInState = updateVisibleErrorsInState.bind(this);
        this.initialiseErrorsInContainer = initialiseErrorsInContainer.bind(this);
        this.updateCurrentErrorsInState = updateCurrentErrorsInState.bind(this);
    }

    componentDidMount() {
        this.setState({ visibleErrors: this.visibleErrors, childrenErrors: this.childrenErrors });
    }

    handleSubmit(e) {
        e.preventDefault();
        //hide B2C errors and only show again if we are going to submit the form to B2C
        this.setState({ showB2CErrors: false });
        //update error messages
        this.updateVisibleErrorsInState();
        //do something to validate and decide if we submit or show errors
        if (this.state.password &&
            this.state.dob &&
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
            b2cDobDay.value = this.state.dob.getDate();
            b2cDobMonth.value = this.state.dob.getMonth() + 1;
            b2cDobYear.value = this.state.dob.getFullYear();
            b2cTermsAndConditions.checked = this.state.tsAndCsAccepted;
            //submit B2C form
            b2cSubmitButton.click();
        }
    }

    render() {

        const formContent =
            <div>
                <components.CreateNewPassword
                    onChange={this.onChange}
                    showErrors={this.state.showErrors}
                    visibleErrors={this.state.visibleErrors}
                    initialiseParentErrors={this.initialiseErrorsInContainer}
                    updateParentErrors={this.updateCurrentErrorsInState} />
                <components.Paragraph errors={this.state.errors}>
                    As an extra security check, please enter your date of birth.
                </components.Paragraph>
                <components.DateOfBirth
                    onChange={this.onChange}
                    showErrors={this.state.showErrors}
                    visibleErrors={this.state.visibleErrors}
                    initialiseParentErrors={this.initialiseErrorsInContainer}
                    updateParentErrors={this.updateCurrentErrorsInState} />
                <components.TermsAndConditions
                    onChange={this.onChange}
                    showErrors={this.state.showErrors}
                    visibleErrors={this.state.visibleErrors}
                    initialiseParentErrors={this.initialiseErrorsInContainer}
                    updateParentErrors={this.updateCurrentErrorsInState} />
            </div>

        const title = 'Activate your account';

        const pageConfig = {
            title: title,
            header: title,
            formContent: formContent,
            submitButtonText: 'Activate account',
            submitHandler: this.handleSubmit,
            errors: this.state.visibleErrors,
            showB2CErrors: this.state.showB2CErrors,
            errorSummaryContent: <components.PasswordHelp />
        };


        return (
            <div id={PAGE_IDS.ACTIVATE_ACCOUNT}>
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default ActivateAccount;