import React from 'react';
import components from '../components';
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

        const submitButtonText = 'Request new activation link';

        const formContent = <div></div>

        const content =
            <components.Paragraph>
                This activation link has expired.
            </components.Paragraph>

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
