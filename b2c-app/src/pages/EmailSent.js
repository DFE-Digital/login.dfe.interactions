import React from 'react';
import components from '../components';
import { getInnerTextById } from '../helpers/dom';
import { ACTIONS } from '../constants/actions';

class EmailSent extends React.Component {

    render() {

        const pageConfig = {
            title: "We've sent you an email"
        };

        const contentFromB2CParagraph =
            <components.Paragraph key='paragraph1'>
                {getInnerTextById('successMessage')}
            </components.Paragraph>

        const accountRequiredParagraph =
            <components.Paragraph key='paragraph2'>
                You will only receive this email if you have an account.
            </components.Paragraph>

        const checkSpamFolderParagraph =
            <components.Paragraph key='paragraph3'>
                Check your spam folder if you can't see it in a few minutes.
            </components.Paragraph>

        const resendActivationLinkParagraph =
            <components.Paragraph key='paragraph4'>
                If you don't receive an email after this time you can&nbsp;
                <components.Link action={ACTIONS.RESET_PASSWORD}>resend password reset email</components.Link>
                .
            </ components.Paragraph>

        const linkExpiresParagraph =
            <components.Paragraph key='paragraph5'>
                This link expires in 24 hours.
            </components.Paragraph>

        const signupLinkParagraph =
            <components.Paragraph key='paragraph6'>
                <components.Link action={ACTIONS.SIGNUP}>I entered the wrong email address</components.Link>
            </components.Paragraph>


        let content;

        if (this.props.action === ACTIONS.SIGNUP) {
            content = [
                contentFromB2CParagraph,
                checkSpamFolderParagraph,
                linkExpiresParagraph,
                signupLinkParagraph
            ];
        }
        else if (this.props.action === ACTIONS.RESET_PASSWORD) {
            content = [
                contentFromB2CParagraph,
                accountRequiredParagraph,
                checkSpamFolderParagraph,
                resendActivationLinkParagraph,
                linkExpiresParagraph
            ];
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
