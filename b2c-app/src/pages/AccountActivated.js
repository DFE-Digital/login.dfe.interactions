import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';
import { LINK_TYPES } from '../constants/linkTypes';

class AccountActivated extends React.Component {

    render() {

        const pageConfig = {
            title: "We've activated your account"
        };

        const content =
            <div>
                <components.Paragraph>You can start using your account to access your information.</components.Paragraph>
                <components.Link type={LINK_TYPES.BUTTON} action={ACTIONS.LOGIN}>Sign in to your account</components.Link>
            </div>

        const columns = [
            {
                header: pageConfig.title,
                aboveFormContent: content
            }
        ];

        return (
            <div id="accountActivated">
                <components.PageContainer pageConfig={pageConfig} columns={columns} />
            </div>
        )
    }

}

export default AccountActivated;