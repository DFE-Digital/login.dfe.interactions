import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';
import { getInnerTextById } from '../helpers/dom';

class AccountFound extends React.Component {

    componentDidMount() {
        document.getElementById('api').style.display = 'none';
        document.title = "We've found your email address | National Careers Service";
    }

    render() {

        const contentFromB2C = getInnerTextById('foundEmailMessageWithEmail');

        return (
            <div id="accountFound">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    <main className="govuk-main-wrapper">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <components.PageTitle size='xl' title='We&apos;ve found your email address' />
                                <components.Paragraph text={contentFromB2C} />
                                <components.Paragraph text={`You'll need to use this email address to sign in to your account.`} />
                                <components.ButtonLink action={ACTIONS.LOGIN} text='Sign in to your account' />
                            </div>
                        </div>
                    </main>

                </div>

            </div>
        )
    }
}

export default AccountFound;