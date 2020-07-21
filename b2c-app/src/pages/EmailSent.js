import React from 'react';
import components from '../components';
import { getInnerTextById } from '../helpers/dom';
import { ACTIONS } from '../constants/actions';
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

        const b2cResultElementId = this.props.action === ACTIONS.CHANGE_EMAIL ? 'confirmationMessage' : 'successMessage';

        const pageConfig = {
            title: "We've sent you an email",
            showSpinner: this.state.showSpinner,
            spinnerText: this.state.spinnerText
        };

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
                <components.Link action={ACTIONS.RESET_PASSWORD}>resend password reset email</components.Link>
                .
            </ components.Paragraph>

        const resendChangeEmailParagraph =
            <components.Paragraph>
                If you don't receive an email after this time you can&nbsp;
                <components.Link action={ACTIONS.RESEND_EMAIL} onClick={this.showSpinner}>resend the activation email</components.Link>
                .
            </ components.Paragraph >

        const linkExpiresParagraph =
            <components.Paragraph>
                This link expires in 24 hours.
            </components.Paragraph>

        const signupLinkParagraph =
            <components.Paragraph>
                <components.Link action={ACTIONS.SIGNUP}>I entered the wrong email address</components.Link>
            </components.Paragraph>

        const signinButton = <components.Link type={LINK_TYPES.BUTTON} action={ACTIONS.LOGIN}>Return to sign in</components.Link>


        let content;

        if (this.props.action === ACTIONS.SIGNUP) {
            content =
                <div>
                    {contentFromB2CParagraph}
                    {checkSpamFolderParagraph}
                    {linkExpiresParagraph}
                    {signupLinkParagraph}
                </div>
        }
        else if (this.props.action === ACTIONS.RESET_PASSWORD) {
            content =
                <div>
                    {contentFromB2CParagraph}
                    {accountRequiredParagraph}
                    {checkSpamFolderParagraph}
                    {resendActivationLinkParagraph}
                    {linkExpiresParagraph}
                </div>
        }
        else if (this.props.action === ACTIONS.CHANGE_EMAIL) {
            content =
                <div>
                    {contentFromB2CParagraph}
                    {checkSpamFolderParagraph}
                    {resendChangeEmailParagraph}
                    {linkExpiresParagraph}
                    {signupLinkParagraph}
                    {signinButton}
                </div>
        }

        const columns = [
            {
                header: pageConfig.title,
                aboveFormContent: content
            }
        ];

        return (

            <div id="emailSent">
                <components.PageContainer pageConfig={pageConfig} columns={columns} />
            </div>
        )
    }
}

export default EmailSent;
