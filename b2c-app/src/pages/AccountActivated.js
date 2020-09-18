import React from 'react';
import components from '../components';
import { POLICIES } from '../constants/policies';
import { LINK_TYPES } from '../constants/linkTypes';
import { PAGE_IDS } from '../constants/pageIds';

class AccountActivated extends React.Component {

    render() {

        const content =
            <div>
                <components.Paragraph>You can start using your account to access your information.</components.Paragraph>
                <components.Link id="signInLink" type={LINK_TYPES.BUTTON} policy={POLICIES.SIGNIN_INVITATION}>Sign in to your account</components.Link>
            </div>

        const title = "We've activated your account";

        const pageConfig = {
            title: title,
            header: title,
            aboveFormContent: content
        };


        return (
            <div id={PAGE_IDS.ACCOUNT_ACTIVATED}>
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }

}

export default AccountActivated;