import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';

class PasswordChanged extends React.Component {

    render() {

        const pageConfig = {
            title: "We've changed your password"
        };

        const content = [
            <components.Paragraph text='Use your new details to sign in and access your information.' key='paragraph' />,
            <components.ButtonLink action={ACTIONS.LOGIN} text='Sign in to your account' key='link' />
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
