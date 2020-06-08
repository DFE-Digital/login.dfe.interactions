import React from 'react';
import components from '../components';
import { getInnerTextById } from '../helpers/dom';
import { ACTIONS } from '../constants/actions';

class EmailSent extends React.Component {

    componentDidMount() {
        document.getElementById('api').style.display = 'none';
        document.title = `We've sent you an email | National Careers Service`;
    }

    render() {

        const contentFromB2C = getInnerTextById('successMessage');

        const resetPasswordLinkParagraph = [
            "If you don't receive an email after this time you can ",
            <components.Link action={ACTIONS.RESET_PASSWORD} text="resend password reset email" key="resetPassword" />,
            "."
        ];

        const resendActivationLink = this.props.action === ACTIONS.RESET_PASSWORD ? resetPasswordLinkParagraph : null;

        const signupLink = this.props.action === ACTIONS.SIGNUP ?
            (
                <components.Link action={ACTIONS.SIGNUP} text="I entered the wrong email address" key="signup" />
            ) :
            null;

        return (
            <div id="emailSent">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    <main className="govuk-main-wrapper">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <components.PageTitle size='xl' title="We've sent you an email" />
                                <components.Paragraph text={contentFromB2C} />
                                <components.Paragraph text="Check your spam folder if you can't see it in a few minutes." />
                                <components.Paragraph text={resendActivationLink} />
                                <components.Paragraph text="This link expires in 24 hours." />
                                <components.Paragraph text={signupLink} />
                            </div>
                        </div>
                    </main>

                </div>

            </div>
        )
    }
}

export default EmailSent;
