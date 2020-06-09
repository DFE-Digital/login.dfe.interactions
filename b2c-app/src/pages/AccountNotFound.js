import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';

class AccountNotFound extends React.Component {

    componentDidMount() {
        document.getElementById('api').style.display = 'none';
        document.title = 'We have not been able to find your account | National Careers Service';
    }

    render() {

        const resetPasswordParagraph = [
            <components.Link action={ACTIONS.RESET_PASSWORD} text="Try again" key="retry" />,
            " with other details you may have used when you created your account."
        ];

        const createNewAccountParagraph = [
            "If you're unable to recover your registered email address, you'll have to ",
            <components.Link action={ACTIONS.SIGNUP} text="create a new account" key="signup" />,
            "."
        ];

        const content = [
            <components.Paragraph text={resetPasswordParagraph} key='paragraph1' />,
            <components.Paragraph text={`If you think you could have more than one account, call 0800 100 900. We'll confirm your details and delete any accounts you do not need.`} key='paragraph2' />,
            <components.Paragraph text={createNewAccountParagraph} key='paragraph3' />
        ];

        return (

            <div id="accountNotFound">
                <components.PageContainer
                    pageTitle="We have not been able to find your account"
                    aboveFormContent={content}
                />
            </div>
        )
    }
}

export default AccountNotFound;
