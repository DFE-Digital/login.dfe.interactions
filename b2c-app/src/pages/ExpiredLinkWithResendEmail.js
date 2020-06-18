import React from 'react';
import components from '../components';

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

        const linkExpiredParagraph =
            <components.Paragraph>
                This activation link has expired.
            </components.Paragraph>

        const formContent = <div></div>

        const content = linkExpiredParagraph;

        const columns = [
            {
                header: pageConfig.title,
                aboveFormContent: content,
                formContent: formContent,
                submitButtonText: 'Request new activation link',
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
