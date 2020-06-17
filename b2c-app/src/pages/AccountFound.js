import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';
import { LINK_TYPES } from '../constants/linkTypes';
import { getInnerTextById } from '../helpers/dom';

class AccountFound extends React.Component {

    render() {

        const pageConfig = {
            title: "We've found your email address"
        };

        const contentFromB2C = getInnerTextById('foundEmailMessageWithEmail');

        const content =
            <div>
                <components.Paragraph>{contentFromB2C}</components.Paragraph>
                <components.Paragraph>You'll need to use this email address to sign in to your account.</components.Paragraph>
                <components.Link type={LINK_TYPES.BUTTON} action={ACTIONS.LOGIN}>Sign in to your account</components.Link>
            </div>

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