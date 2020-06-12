import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';

class ExpiredLink extends React.Component {

    render() {

        const pageConfig = {
            title: "Expired link"
        };

        let linkExpiredParagraph;
        let requestAgainLink;

        if (this.props.action === ACTIONS.RESET_PASSWORD) {
            linkExpiredParagraph =
                <components.Paragraph>
                    The link in your password reset email has expired.
                </components.Paragraph>

            requestAgainLink =
                <components.ButtonLink action={ACTIONS.RESET_PASSWORD}>Resend password reset email</components.ButtonLink>

        }
        else if (this.props.action === ACTIONS.SIGNUP) {
            linkExpiredParagraph =
                <components.Paragraph>
                    The link in your account activation email has expired.
                </components.Paragraph>

            //TODO split this into two versions if self registration and aided registration have different pages to resend email
            requestAgainLink =
                <components.ButtonLink action={ACTIONS.RESEND_ACTIVATION_EMAIL}>Resend activation email</components.ButtonLink>
        }


        const content =
            <div>
                {linkExpiredParagraph}
                <components.Paragraph>
                    Request another email.
                </components.Paragraph>
                {requestAgainLink}
            </div>

        const columns = [
            {
                header: pageConfig.title,
                aboveFormContent: content
            }
        ];

        return (

            <div id="expiredLink">
                <components.PageContainer pageConfig={pageConfig} columns={columns} />
            </div>
        )
    }
}

export default ExpiredLink;
