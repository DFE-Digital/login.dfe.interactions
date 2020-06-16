import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';

class AccountNotFound extends React.Component {

    render() {

        const pageConfig = {
            title: "Unable to find your account"
        };

        const content =
            <div>
                <components.Paragraph>
                    <components.Link action={ACTIONS.RESET_PASSWORD}>Try again</components.Link>
                    &nbsp;with other details you may have used when you created your account.
                </components.Paragraph>
                <components.Paragraph>
                    If you think you could have more than one account, call 0800 100 900. We'll confirm your details and delete any accounts you do not need.
                </components.Paragraph>
                <components.Paragraph>
                    If you're unable to recover your registered email address, you'll have to&nbsp;
                    <components.Link action={ACTIONS.SIGNUP}>create a new account</components.Link>
                    .
                </components.Paragraph>
            </div>

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
