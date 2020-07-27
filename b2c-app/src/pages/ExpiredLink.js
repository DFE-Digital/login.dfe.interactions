import React from 'react';
import components from '../components';
import { POLICIES } from '../constants/policies';
import { LINK_TYPES } from '../constants/linkTypes';

class ExpiredLink extends React.Component {

    render() {

        let linkExpiredParagraph;
        let requestAgainLink;

        //we keep the logic to check different policies passed in, in case we have to reuse this page for different flows again
        if (this.props.policy === POLICIES.PASSWORD_RESET) {
            linkExpiredParagraph =
                <components.Paragraph>
                    The link in your password reset email has expired.
                </components.Paragraph>

            requestAgainLink =
                <components.Link type={LINK_TYPES.BUTTON} policy={POLICIES.PASSWORD_RESET}>Resend password reset email</components.Link>
        }

        const content =
            <div>
                {linkExpiredParagraph}
                <components.Paragraph>
                    Request another email.
                </components.Paragraph>
                {requestAgainLink}
            </div>

        const title = 'Expired link';

        const pageConfig = {
            title: title,
            header: title,
            aboveFormContent: content
        };


        return (
            <div id="expiredLink">
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default ExpiredLink;
