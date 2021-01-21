import React from 'react';
import components from '../components';
import { POLICIES } from '../constants/policies';
import { LINK_TYPES } from '../constants/linkTypes';
import { PAGE_IDS } from '../constants/pageIds';

class ExpiredLink extends React.Component {

    render() {

        let paragraphText;
        let link;

        if (this.props.policy === POLICIES.SIGNUP_INVITATION ||
            this.props.policy === POLICIES.ACCOUNT_SIGNUP ||
            this.props.policy === POLICIES.SIGNUP_CONFIRMATION ||
            this.props.policy === POLICIES.RESEND_EMAIL) {

            paragraphText = 'The link in your account activation email has expired.';
            link =
                <components.Link id="resendEmailLink" type={LINK_TYPES.BUTTON} policy={POLICIES.RESEND_EMAIL}>
                    Resend activation email
                </components.Link>

        } else if (this.props.policy === POLICIES.PASSWORD_RESET ||
            this.props.policy === POLICIES.PASSWORD_RESET_CONFIRMATION) {

            paragraphText = 'The link in your password reset email has expired.';
            link =
                <components.Link id="resendEmailLink" type={LINK_TYPES.BUTTON} policy={POLICIES.PASSWORD_RESET}>
                    Resend password reset email
                </components.Link>
        }


        const content =
            <div>
                <components.Paragraph>
                    {paragraphText}
                </components.Paragraph>
                {link}
            </div>

        const title = 'Expired link';

        const pageConfig = {
            title: title,
            header: title,
            aboveFormContent: content
        };


        return (
            <div id={PAGE_IDS.EXPIRED_LINK}>
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default ExpiredLink;
