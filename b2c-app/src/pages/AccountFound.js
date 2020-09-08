import React from 'react';
import components from '../components';
import { POLICIES } from '../constants/policies';
import { LINK_TYPES } from '../constants/linkTypes';
import { PAGE_IDS } from '../constants/pageIds';
import { getInnerTextById } from '../helpers/dom';

class AccountFound extends React.Component {

    render() {

        const contentFromB2C = getInnerTextById('foundEmailMessageWithEmail');

        const content =
            <div>
                <components.Paragraph>{contentFromB2C}</components.Paragraph>
                <components.Paragraph>You'll need to use this email address to sign in to your account.</components.Paragraph>
                <components.Link id="signInLink" type={LINK_TYPES.BUTTON} policy={POLICIES.SIGNIN_INVITATION}>Sign in to your account</components.Link>
            </div>

        const title = "We've found your email address";

        const pageConfig = {
            title: title,
            header: title,
            aboveFormContent: content
        };


        return (
            <div id={PAGE_IDS.ACCOUNT_FOUND}>
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default AccountFound;