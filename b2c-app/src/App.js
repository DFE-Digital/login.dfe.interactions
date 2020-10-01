import React from 'react';

import * as ServerSideQueryParamsService from './services/ServerSideQueryParamsService';

import Signup from './pages/Signup';
import Login from './pages/Login';
import EmailSent from './pages/EmailSent';
import AccountActivated from './pages/AccountActivated';
import ResetPassword from './pages/ResetPassword';
import ForgottenEmail from './pages/ForgottenEmail';
import AccountNotFound from './pages/AccountNotFound';
import AccountFound from './pages/AccountFound';
import PasswordChanged from './pages/PasswordChanged';
import Placeholder from './pages/Placeholder';
import EnterNewPassword from './pages/EnterNewPassword';
import ActivateAccount from './pages/AidedRegistration/ActivateAccount';
import ExpiredLink from './pages/ExpiredLink';
import ExpiredLinkWithResendEmail from './pages/ExpiredLinkWithResendEmail';
import ResendActivationEmail from './pages/ResendActivationEmail';
import PageNotFound from './pages/PageNotFound';
import AccountNotActivated from './pages/AccountNotActivated';
import UpdatedTermsAndConditions from './pages/UpdatedTermsAndConditions';

import components from './components';

import {
  Switch,
  Route
} from "react-router-dom";

import { withRouter } from "react-router";
import { QUERY_PARAMS } from './constants/queryParams';
import { PAGE_IDS } from './constants/pageIds';

class App extends React.Component {

  getComponentByLocation() {

    const page = ServerSideQueryParamsService.getQueryParam(QUERY_PARAMS.PAGE);
    let policy = ServerSideQueryParamsService.getQueryParam(QUERY_PARAMS.POLICY);

    if (page && policy) {

      let result;

      switch (page) {

        case PAGE_IDS.LOGIN:
          result = <Login />;
          break;

        case PAGE_IDS.SIGNUP:
          result = <Signup />;
          break;

        case PAGE_IDS.EMAIL_SENT:
          result = <EmailSent policy={policy} />;
          break;

        case PAGE_IDS.EXPIRED_LINK:
          result = <ExpiredLink policy={policy} />;
          break;

        case PAGE_IDS.EXPIRED_LINK_WITH_RESEND:
          result = <ExpiredLinkWithResendEmail policy={policy} />;
          break;

        case PAGE_IDS.ACCOUNT_ACTIVATED:
          result = <AccountActivated />;
          break;

        case PAGE_IDS.ACTIVATE_ACCOUNT:
          result = <ActivateAccount />;
          break;

        case PAGE_IDS.RESET_PASSWORD:
          result = <ResetPassword />;
          break;

        case PAGE_IDS.ENTER_NEW_PASSWORD:
          result = <EnterNewPassword />;
          break;

        case PAGE_IDS.PASSWORD_CHANGED:
          result = <PasswordChanged />;
          break;

        case PAGE_IDS.FORGOTTEN_EMAIL:
          result = <ForgottenEmail />;
          break;

        case PAGE_IDS.ACCOUNT_FOUND:
          result = <AccountFound />;
          break;

        case PAGE_IDS.ACCOUNT_NOT_FOUND:
          result = <AccountNotFound />;
          break;

        case PAGE_IDS.NOT_FOUND:
          result = <PageNotFound />;
          break;

        case PAGE_IDS.RESEND_ACTIVATION_EMAIL:
          result = <ResendActivationEmail />;
          break;

        case PAGE_IDS.ACCOUNT_NOT_ACTIVATED:
          result = <AccountNotActivated />;
          break;

        case PAGE_IDS.UPDATED_TERMS_AND_CONDITIONS:
          result = <UpdatedTermsAndConditions />;
          break;

        default:
          result = <PageNotFound />;
          break;
      }

      return result;
    }

    return <Placeholder />;

  }

  render() {

    let component = this.getComponentByLocation();

    return (
      <div className="App" id="app">

        {/* header */}
        <components.Header />

        {/* routing */}
        <div id="routes">
          <Switch>
            <Route path="/">
              {component}
            </Route>
          </Switch>
        </div>

        {/* footer */}
        <components.Footer />

      </div>
    )
  }
}

export default withRouter(App);