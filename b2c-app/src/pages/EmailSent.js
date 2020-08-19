import React from 'react';
import components from '../components';
import { getInnerTextById } from '../helpers/dom';
import { POLICIES } from '../constants/policies';
import { LINK_TYPES } from '../constants/linkTypes';
import { PAGE_IDS } from '../constants/pageIds';
import { QUERY_PARAMS } from '../constants/queryParams';
import * as ServerSideQueryParamsService from '../services/ServerSideQueryParamsService';

class EmailSent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showSpinner: false,
            spinnerText: null
        }
        this.showSpinner = this.showSpinner.bind(this);
    }

    showSpinner() {
        //start spinner
        this.setState({ spinnerText: 'Sending activation email. Please wait.', showSpinner: true })
    }

    buildResendEmailParagraph(linkToPolicy, linkText, showSpinner) {
        return (
            <components.Paragraph>
                If you don't receive an email after this time you can&nbsp;
                <components.Link id='resendEmailLink' policy={linkToPolicy} onClick={showSpinner && this.showSpinner}>{linkText}</components.Link>
                .
            </ components.Paragraph >
        )
    }

    render() {

        let policyForContent;

        if (this.props.policy === POLICIES.RESEND_EMAIL) {
            // retrieve the original policy that the resent email was for
            // and then use it to show page content accordingly
            // if not found, use resend email by default
            policyForContent = ServerSideQueryParamsService.getQueryParam(QUERY_PARAMS.ORIGINAL_POLICY) || POLICIES.RESEND_EMAIL;

        } else {
            policyForContent = this.props.policy;
        }

        let b2cResultElementId;
        if (policyForContent === POLICIES.CHANGE_EMAIL || policyForContent === POLICIES.SIGNIN_INVITATION) {
            b2cResultElementId = 'confirmationMessage';
        } else {
            b2cResultElementId = 'successMessage';
        }

        const contentFromB2CParagraph =
            <components.Paragraph id='emailSentTo'>
                {getInnerTextById(b2cResultElementId)}
            </components.Paragraph>

        const accountRequiredParagraph =
            <components.Paragraph>
                You will only receive this email if you have an account.
            </components.Paragraph>

        const checkSpamFolderParagraph =
            <components.Paragraph>
                Check your spam folder if you can't see it in a few minutes.
            </components.Paragraph>

        const linkExpiresParagraph =
            <components.Paragraph>
                This link expires in 24 hours.
            </components.Paragraph>

        const changedIncorrectEmailParagraph =
            <components.Paragraph>
                If you changed your details to an incorrect email address and have been locked out of your account,&nbsp;
                <components.Link id="contactUsLink" url="https://nationalcareers.service.gov.uk/contact-us">contact us</components.Link>
                .
            </components.Paragraph>

        const signinButton = <components.Link id="signInLink" type={LINK_TYPES.BUTTON} policy={POLICIES.SIGNIN_INVITATION}>Return to sign in</components.Link>


        let content;

        switch (policyForContent) {

            case POLICIES.ACCOUNT_SIGNUP:
            case POLICIES.SIGNUP_CONFIRMATION:
                content =
                    <div>
                        {contentFromB2CParagraph}
                        {checkSpamFolderParagraph}
                        {this.buildResendEmailParagraph(POLICIES.RESEND_EMAIL, 'resend the activation email', false)}
                        {linkExpiresParagraph}
                    </div>
                break;

            case POLICIES.SIGNUP_INVITATION:
                content =
                    <div>
                        {contentFromB2CParagraph}
                        {accountRequiredParagraph}
                        {checkSpamFolderParagraph}
                        {this.buildResendEmailParagraph(POLICIES.RESEND_EMAIL, 'resend the activation email', false)}
                        {linkExpiresParagraph}
                    </div>
                break;

            case POLICIES.SIGNIN_INVITATION:
                content =
                    <div>
                        {contentFromB2CParagraph}
                        {checkSpamFolderParagraph}
                        {this.buildResendEmailParagraph(POLICIES.RESEND_EMAIL, 'resend the activation email', false)}
                        {linkExpiresParagraph}
                        {changedIncorrectEmailParagraph}
                    </div>
                break;

            case POLICIES.CHANGE_EMAIL:
            case POLICIES.RESEND_EMAIL:
                content =
                    <div>
                        {contentFromB2CParagraph}
                        {checkSpamFolderParagraph}
                        {this.buildResendEmailParagraph(POLICIES.RESEND_EMAIL, 'resend the activation email', true)}
                        {linkExpiresParagraph}
                        {signinButton}
                    </div>
                break;

            case POLICIES.PASSWORD_RESET:
            case POLICIES.PASSWORD_RESET_CONFIRMATION:
                content =
                    <div>
                        {contentFromB2CParagraph}
                        {accountRequiredParagraph}
                        {checkSpamFolderParagraph}
                        {this.buildResendEmailParagraph(POLICIES.PASSWORD_RESET, 'resend password reset email', false)}
                        {linkExpiresParagraph}
                    </div>
                break;
        }

        const title = "We've sent you an email";

        const pageConfig = {
            title: title,
            header: title,
            aboveFormContent: content,
            showSpinner: this.state.showSpinner,
            spinnerText: this.state.spinnerText
        };


        return (
            <div id={PAGE_IDS.EMAIL_SENT}>
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default EmailSent;
