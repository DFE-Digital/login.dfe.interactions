import React from 'react';
import components from '../components';
import { getInnerTextById } from '../helpers/dom';
import { ACTIONS } from '../constants/actions';

class EmailSent extends React.Component {

    render() {

        const pageConfig = {
            title: "We've sent you an email"
        };

        const contentFromB2C = getInnerTextById('successMessage');
        const contentFromB2CParagraph = <components.Paragraph text={contentFromB2C} key='paragraph1' />;

        const accountRequiredParagraph = <components.Paragraph text='You will only receive this email if you have an account.' key='paragraph2' />;

        const checkSpamFolderParagraph = <components.Paragraph text="Check your spam folder if you can't see it in a few minutes." key='paragraph3' />;

        const resendActivationLink = [
            "If you don't receive an email after this time you can ",
            <components.Link action={ACTIONS.RESET_PASSWORD} text="resend password reset email" key="resetPassword" />,
            "."
        ];
        const resendActivationLinkParagraph = <components.Paragraph text={resendActivationLink} key='paragraph4' />;

        const linkExpiresParagraph = <components.Paragraph text="This link expires in 24 hours." key='paragraph5' />;

        const signupLink = <components.Link action={ACTIONS.SIGNUP} text="I entered the wrong email address" />;
        const signupLinkParagraph = <components.Paragraph text={signupLink} key='paragraph6' />;



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
