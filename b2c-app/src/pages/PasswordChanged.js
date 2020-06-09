import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';

class PasswordChanged extends React.Component {

    render() {

        const content = [
            <components.Paragraph text='Use your new details to sign in and access your information.' key='paragraph' />,
            <components.ButtonLink action={ACTIONS.LOGIN} text='Sign in to your account' key='link' />
        ];

        return (

            <div id="passwordChanged">
                <components.PageContainer
                    pageTitle="We've changed your password"
                    aboveFormContent={content}
                />
            </div>
        )
    }

}

export default PasswordChanged;
