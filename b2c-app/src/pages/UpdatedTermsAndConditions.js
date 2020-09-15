import React from 'react';
import { animateScroll } from "react-scroll";

import components from '../components';

import { onChange } from '../helpers/pageUpdatesHandler';
import {
    updateVisibleErrorsInState,
    initialiseErrorsInContainer,
    updateCurrentErrorsInState
} from '../helpers/pageErrorHandler';

class UpdatedTermsAndConditions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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

        this.updateVisibleErrorsInState();

        //do something to validate and decide if we submit or show errors
        if (this.state.tsAndCsAccepted) {
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
        let b2cTermsAndConditions = document.getElementById('tncCheckbox_true');
        let b2cSubmitButton = document.getElementById('continue');

        if (b2cTermsAndConditions && b2cSubmitButton) {
            b2cTermsAndConditions.checked = this.state.tsAndCsAccepted;
            //submit B2C form
            b2cSubmitButton.click();
        }
    }

    render() {

        const content =
            <div>
                <components.Paragraph>You need to accept the updated terms and conditions to access your account.</components.Paragraph>
            </div>

        const formContent =
            <div>
                <components.TermsAndConditions
                    onChange={this.onChange}
                    showErrors={this.state.showErrors}
                    visibleErrors={this.state.visibleErrors}
                    initialiseParentErrors={this.initialiseErrorsInContainer}
                    updateParentErrors={this.updateCurrentErrorsInState} />
            </div>

        /**
         * Page configuration
         */
        const title = 'Updated terms and conditions';

        const pageConfig = {
            title: title,
            header: title,
            aboveFormContent: content,
            formContent: formContent,
            submitButtonText: 'Continue to your account',
            submitHandler: this.handleSubmit,
            errors: this.state.visibleErrors,
            showB2CErrors: this.state.showB2CErrors
        };


        return (
            <div id="updatedTermsAndConditions">
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default UpdatedTermsAndConditions;
