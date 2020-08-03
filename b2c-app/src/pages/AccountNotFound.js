import React from 'react';
import components from '../components';
import { POLICIES } from '../constants/policies';

class AccountNotFound extends React.Component {

    render() {

        const content =
            <div>
                <components.Paragraph>
                    <components.Link id="resetPasswordLink" policy={POLICIES.PASSWORD_RESET}>Try again</components.Link>
                    &nbsp;with other details you may have used when you created your account.
                </components.Paragraph>
                <components.Paragraph>
                    If you think you could have more than one account, call 0800 100 900. We'll confirm your details and delete any accounts you do not need.
                </components.Paragraph>
                <components.Paragraph>
                    If you're unable to recover your registered email address, you'll have to create a new account.
                </components.Paragraph>
            </div>

        const title = 'We have not been able to find your account';

        const pageConfig = {
            title: title,
            header: title,
            aboveFormContent: content
        };


        return (
            <div id="accountNotFound">
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default AccountNotFound;
