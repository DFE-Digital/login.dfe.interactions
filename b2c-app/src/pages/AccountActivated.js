import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';

class AccountActivated extends React.Component {

    render() {

        const content = [
            <components.Paragraph text='You can start using your account to access your information.' key='paragraph' />,
            <components.ButtonLink action={ACTIONS.LOGIN} text='Sign in to your account' key='link' />
        ];

        return (

            <div id="accountActivated">
                <components.PageContainer
                    pageTitle="We've activated your account"
                    aboveFormContent={content}
                />
            </div>
        )
    }

}

export default AccountActivated;