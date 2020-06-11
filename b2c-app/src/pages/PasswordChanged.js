import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';

class PasswordChanged extends React.Component {

    render() {

        const pageConfig = {
            title: "We've changed your password"
        };

        const content = [
            <components.Paragraph key='paragraph'>Use your new details to sign in and access your information.</components.Paragraph>,
            <components.ButtonLink action={ACTIONS.LOGIN} key='link'>Sign in to your account</components.ButtonLink>
        ];

        const columns = [
            {
                header: pageConfig.title,
                aboveFormContent: content
            }
        ];

        return (

            <div id="passwordChanged">
                <components.PageContainer pageConfig={pageConfig} columns={columns} />
            </div>
        )
    }

}

export default PasswordChanged;
