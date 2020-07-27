import React from 'react';
import components from '../components';
import { getInnerTextById } from '../helpers/dom';
import { POLICIES } from '../constants/policies';
import { LINK_TYPES } from '../constants/linkTypes';

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

        const resendActivationLinkParagraph =
            <components.Paragraph>
                If you don't receive an email after this time you can&nbsp;
                <components.Link policy={POLICIES.PASSWORD_RESET}>resend password reset email</components.Link>
                .
            </ components.Paragraph>

        const resendChangeEmailParagraph =
            <components.Paragraph>
                If you don't receive an email after this time you can&nbsp;
                <components.Link policy={POLICIES.RESEND_EMAIL} onClick={this.showSpinner}>resend the activation email</components.Link>
                .
            </ components.Paragraph >

        const linkExpiresParagraph =
            <components.Paragraph>
                This link expires in 24 hours.
            </components.Paragraph>

        const signinButton = <components.Link type={LINK_TYPES.BUTTON} policy={POLICIES.SIGNIN_INVITATION}>Return to sign in</components.Link>


        let content;

        if (this.props.policy === POLICIES.SIGNUP_INVITATION || this.props.policy === POLICIES.ACCOUNT_SIGNUP) {
            content =
                <div>
                    {contentFromB2CParagraph}
                    {checkSpamFolderParagraph}
                    {linkExpiresParagraph}
                </div>
        }
        else if (this.props.policy === POLICIES.PASSWORD_RESET) {
            content =
                <div>
                    {contentFromB2CParagraph}
                    {accountRequiredParagraph}
                    {checkSpamFolderParagraph}
                    {resendActivationLinkParagraph}
                    {linkExpiresParagraph}
                </div>
        }
        else if (this.props.policy === POLICIES.CHANGE_EMAIL) {
            content =
                <div>
                    {contentFromB2CParagraph}
                    {checkSpamFolderParagraph}
                    {resendChangeEmailParagraph}
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
            <div id="emailSent">
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default EmailSent;
