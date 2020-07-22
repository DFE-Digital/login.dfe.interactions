import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';
import { LINK_TYPES } from '../constants/linkTypes';

class ExpiredLink extends React.Component {

    render() {

        let linkExpiredParagraph;
        let requestAgainLink;

        //we keep the logic to check different actions passed in, in case we have to reuse this page for different flows again
        if (this.props.action === ACTIONS.RESET_PASSWORD) {
            linkExpiredParagraph =
                <components.Paragraph>
                    The link in your password reset email has expired.
                </components.Paragraph>

            requestAgainLink =
                <components.Link type={LINK_TYPES.BUTTON} action={ACTIONS.RESET_PASSWORD}>Resend password reset email</components.Link>
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
