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

        return (
            <div id="accountNotFound">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    <main className="govuk-main-wrapper">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <components.PageTitle size='xl' title='We have not been able to find your account' />
                                <components.Paragraph text={resetPasswordParagraph} />
                                <components.Paragraph text={`If you think you could have more than one account, call 0800 100 900. We'll confirm your details and delete any accounts you do not need.`} />
                                <components.Paragraph text={createNewAccountParagraph} />
                            </div>
                        </div>
                    </main>

                </div>

            </div>
        )
    }
}

export default AccountNotFound;
