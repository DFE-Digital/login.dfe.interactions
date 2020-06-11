import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';
import { getInnerTextById } from '../helpers/dom';

class AccountFound extends React.Component {

    render() {

        const pageConfig = {
            title: "We've found your email address"
        };

        const contentFromB2C = getInnerTextById('foundEmailMessageWithEmail');

        const content = [
            <components.Paragraph key='paragraph1'>{contentFromB2C}</components.Paragraph>,
            <components.Paragraph key='paragraph2'>You'll need to use this email address to sign in to your account.</components.Paragraph>,
            <components.ButtonLink action={ACTIONS.LOGIN} text='Sign in to your account' key='link' />
        ];

        const columns = [
            {
                header: pageConfig.title,
                aboveFormContent: content
            }
        ];

        return (

            <div id="accountFound">
                <components.PageContainer pageConfig={pageConfig} columns={columns} />
            </div>
        )
    }
}

export default AccountFound;