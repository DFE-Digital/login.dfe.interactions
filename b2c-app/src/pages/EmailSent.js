import React from 'react';
import ChangeEmailService from '../services/ChangeEmailService';
import components from '../components';
import { getInnerTextById } from '../helpers/dom';
import { ACTIONS } from '../constants/actions';
import { LINK_TYPES } from '../constants/linkTypes';

class EmailSent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showSpinner: false,
            spinnerText: null,
            showErrors: false,
            errors: []
        }
        this.resendEmail = this.resendEmail.bind(this);
        this.showPageLevelError = this.showPageLevelError.bind(this);
        this.clearPageLevelError = this.clearPageLevelError.bind(this);
    }

    showPageLevelError(errorMessage) {
        const newError = {
            visible: {
                text: errorMessage
            }
        };

        this.setState({ errors: [newError], showErrors: true });
    }

    clearPageLevelError() {
        this.setState({ errors: [], showErrors: false });
    }

    resendEmail(e) {
        e.preventDefault();

        //start spinner
        this.setState({ spinnerText: 'Sending activation email. Please wait.', showSpinner: true })

        //make call to API to resend email
        ChangeEmailService.callResendEmail().then(
            () => {
                //clear error messages if there were any from previous calls
                this.clearPageLevelError();
            },
            (error) => {
                if (error.userMessage) {
                    this.showPageLevelError(error.userMessage);
                }
                else {
                    this.showPageLevelError('The activation email could not be sent.');
                }
            })
            .finally(
                () => {
                    //stop spinner
                    this.setState({ showSpinner: false });
                }
            );
    }


    render() {

        const b2cResultElementId = this.props.action === ACTIONS.CHANGE_EMAIL ? 'confirmationMessage' : 'successMessage';

        const pageConfig = {
            title: "We've sent you an email",
            errors: this.state.errors,
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
                <components.Link type={LINK_TYPES.API_CALL} onClick={this.resendEmail}>resend the activation email</components.Link>
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
