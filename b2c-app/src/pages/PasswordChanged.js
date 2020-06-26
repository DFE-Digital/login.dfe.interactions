import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';
import { LINK_TYPES } from '../constants/linkTypes';

class PasswordChanged extends React.Component {

    render() {

        const pageConfig = {
            title: "We've changed your password"
        };

        const content =
            <div>
                <components.Paragraph>Use your new details to sign in and access your information.</components.Paragraph>
                <components.Link type={LINK_TYPES.BUTTON} action={ACTIONS.LOGIN}>Sign in to your account</components.Link>
            </div>

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
