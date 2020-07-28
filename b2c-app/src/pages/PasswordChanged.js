import React from 'react';
import components from '../components';
import { POLICIES } from '../constants/policies';
import { LINK_TYPES } from '../constants/linkTypes';
import { PAGE_IDS } from '../constants/pageIds';

class PasswordChanged extends React.Component {

    render() {

        const content =
            <div>
                <components.Paragraph>Use your new details to sign in and access your information.</components.Paragraph>
                <components.Link type={LINK_TYPES.BUTTON} policy={POLICIES.SIGNIN_INVITATION}>Sign in to your account</components.Link>
            </div>

        const title = "We've changed your password";

        const pageConfig = {
            title: title,
            header: title,
            aboveFormContent: content
        };


        return (
            <div id={PAGE_IDS.PASSWORD_CHANGED}>
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }

}

export default PasswordChanged;
