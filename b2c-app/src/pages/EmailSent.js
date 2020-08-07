import React from 'react';
import components from '../components';
import { getInnerTextById } from '../helpers/dom';
import { POLICIES } from '../constants/policies';
import { LINK_TYPES } from '../constants/linkTypes';
import { PAGE_IDS } from '../constants/pageIds';

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

        const b2cResultElementId = this.props.policy === POLICIES.CHANGE_EMAIL ? 'confirmationMessage' : 'successMessage';

        const contentFromB2CParagraph =
            <components.Paragraph>
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

        const signinButton = <components.Link id="signInLink" type={LINK_TYPES.BUTTON} policy={POLICIES.SIGNIN_INVITATION}>Return to sign in</components.Link>


        let content;

        if (this.props.policy === POLICIES.SIGNUP_INVITATION ||
            this.props.policy === POLICIES.ACCOUNT_SIGNUP ||
            this.props.policy === POLICIES.SIGNUP_CONFIRMATION) {

            content =
                <div>
                    {contentFromB2CParagraph}
                    {checkSpamFolderParagraph}
                    {this.buildResendEmailParagraph(POLICIES.RESEND_EMAIL, 'resend the activation email', false)}
                    {linkExpiresParagraph}
                </div>
        }
        else if (this.props.policy === POLICIES.PASSWORD_RESET ||
            this.props.policy === POLICIES.PASSWORD_RESET_CONFIRMATION) {

            content =
                <div>
                    {contentFromB2CParagraph}
                    {accountRequiredParagraph}
                    {checkSpamFolderParagraph}
                    {this.buildResendEmailParagraph(POLICIES.PASSWORD_RESET, 'resend password reset email', false)}
                    {linkExpiresParagraph}
                </div>
        }
        else if (this.props.policy === POLICIES.CHANGE_EMAIL ||
            this.props.policy === POLICIES.RESEND_EMAIL) {

            content =
                <div>
                    {contentFromB2CParagraph}
                    {checkSpamFolderParagraph}
                    {this.buildResendEmailParagraph(POLICIES.RESEND_EMAIL, 'resend the activation email', true)}
                    {linkExpiresParagraph}
                    {signinButton}
                </div>
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