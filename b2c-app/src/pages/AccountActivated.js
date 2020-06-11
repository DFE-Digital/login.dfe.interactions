import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';

class AccountActivated extends React.Component {

    render() {

        const pageConfig = {
            title: "We've activated your account"
        };

        const content = [
            <components.Paragraph key='paragraph'>You can start using your account to access your information.</components.Paragraph>,
            <components.ButtonLink action={ACTIONS.LOGIN} key='link'>Sign in to your account</components.ButtonLink>
        ];

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