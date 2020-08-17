import React from 'react';
import components from '../components';
import { PAGE_IDS } from '../constants/pageIds';

class AccountNotActivated extends React.Component {

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

        const title = 'Account requires activation';
        const submitButtonText = 'Resend account activation link';

        const formContent = <div></div>

        const content =
            <div>
                <components.Paragraph>
                    Our records show that you have recently updated information about your account.
                </components.Paragraph>
                <components.Paragraph>
                    You need to complete activation before you can access your account.
                </components.Paragraph>
            </div>

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
            <div id={PAGE_IDS.ACCOUNT_NOT_ACTIVATED}>
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default AccountNotActivated;
