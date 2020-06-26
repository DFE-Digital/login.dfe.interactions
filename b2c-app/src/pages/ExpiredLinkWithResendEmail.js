import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';

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

        const pageConfig = {
            title: "Activation link expired",
            showB2CErrors: this.state.showB2CErrors,
            errors: this.state.errors
        };

        let linkExpiredText;
        let submitButtonText;

        if (this.props.action === ACTIONS.SIGNUP) {
            linkExpiredText = 'The link in your account activation email has expired.';
            submitButtonText = 'Resend activation email';
        }
        else if (this.props.action === ACTIONS.CHANGE_EMAIL) {
            linkExpiredText = 'This activation link has expired.';
            submitButtonText = 'Request new activation link';
        }

        const linkExpiredParagraph =
            <components.Paragraph>
                {linkExpiredText}
            </components.Paragraph>

        const formContent = <div></div>

        const content = linkExpiredParagraph;

        const columns = [
            {
                header: pageConfig.title,
                aboveFormContent: content,
                formContent: formContent,
                submitButtonText: submitButtonText,
                submitHandler: this.handleSubmit
            }
        ];

        return (

            <div id="expiredLink" >
                <components.PageContainer pageConfig={pageConfig} columns={columns} />
            </div>
        )
    }
}

export default ExpiredLinkWithResendEmail;
