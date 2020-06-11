import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';

class AccountNotFound extends React.Component {

    render() {

        const pageConfig = {
            title: "We have not been able to find your account"
        };

        const content = [
            <components.Paragraph key='paragraph1'>
                <components.Link action={ACTIONS.RESET_PASSWORD} text="Try again" key="retry" />
                &nbsp;with other details you may have used when you created your account.
            </components.Paragraph>,
            <components.Paragraph key='paragraph2'>
                If you think you could have more than one account, call 0800 100 900. We'll confirm your details and delete any accounts you do not need.
            </components.Paragraph>,
            <components.Paragraph key='paragraph3'>
                If you're unable to recover your registered email address, you'll have to&nbsp;
                <components.Link action={ACTIONS.SIGNUP} text="create a new account" key="signup" />
                .
            </components.Paragraph>
        ];

        const columns = [
            {
                header: pageConfig.title,
                aboveFormContent: content
            }
        ];

        return (

            <div id="accountNotFound">
                <components.PageContainer pageConfig={pageConfig} columns={columns} />
            </div>
        )
    }
}

export default AccountNotFound;
