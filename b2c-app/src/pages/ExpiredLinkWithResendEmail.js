import React from 'react';
import components from '../components';
import { POLICIES } from '../constants/policies';
import { PAGE_IDS } from '../constants/pageIds';

class ExpiredLinkWithResendEmail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showB2CErrors: true,
            errors: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let b2cResendEmailButton = document.getElementById('continue');
        if (b2cResendEmailButton) {
            b2cResendEmailButton.click();
        }
    }

    render() {

        let linkExpiredText;
        let submitButtonText;

        if (this.props.policy === POLICIES.SIGNUP_INVITATION || this.props.policy === POLICIES.ACCOUNT_SIGNUP) {
            linkExpiredText = 'The link in your account activation email has expired.';
            submitButtonText = 'Resend activation email';
        }
        else if (this.props.policy === POLICIES.CHANGE_EMAIL) {
            linkExpiredText = 'This activation link has expired.';
            submitButtonText = 'Request new activation link';
        }

        const linkExpiredParagraph =
            <components.Paragraph>
                {linkExpiredText}
            </components.Paragraph>

        const formContent = <div></div>

        const content = linkExpiredParagraph;

        const title = 'Activation link expired';

        const pageConfig = {
            title: title,
            header: title,
            aboveFormContent: content,
            formContent: formContent,
            submitButtonText: submitButtonText,
            submitHandler: this.handleSubmit,
            showB2CErrors: this.state.showB2CErrors,
            errors: this.state.errors
        };


        return (
            <div id={PAGE_IDS.EXPIRED_LINK_WITH_RESEND}>
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default ExpiredLinkWithResendEmail;
