import React from 'react';

import { ACTIONS } from './constants/actions';

import { domHasElementWithId } from './helpers/dom';
import { matchesPath, hasSearchParam } from './helpers/urls';

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

import components from './components';

import {
  Switch,
  Route
} from "react-router-dom";

import { withRouter } from "react-router";

class App extends React.Component {

  getComponentByLocation() {
    const { location } = this.props;

    //Policy names
    const SIGNIN_INVITATION = 'B2C_1A_signin_invitation';
    const ACCOUNT_SIGNUP = 'B2C_1A_account_signup';
    const PASSWORD_RESET = 'B2C_1A_passwordreset';
    const PASSWORD_RESET_CONFIRMATION = 'B2C_1A_passwordResetConformation';
    const FIND_EMAIL = 'B2C_1A_findEmail';
    const SIGNUP_CONFIRMATION = 'B2C_1A_signup_confirmation';
    const SIGNUP_INVITATION = 'B2C_1A_signup_invitation';

    //Ids in B2C dom that we will be looking for
    const ERROR_MESSAGE = 'errorMessage';
    const SUCCESS_MESSAGE = 'successMessage';

    //Login page
    if (matchesPath(location, SIGNIN_INVITATION) || hasSearchParam(location.search, 'p', SIGNIN_INVITATION)) {
      return <Login />;
    }
    //Activation email sent after sign up
    if (matchesPath(location, `${ACCOUNT_SIGNUP}/api`)) {
      return <EmailSent action={ACTIONS.SIGNUP} />;
    }
    //Sign up page
    if (matchesPath(location, ACCOUNT_SIGNUP) || hasSearchParam(location.search, 'p', ACCOUNT_SIGNUP)) {
      return <Signup />;
    }
    //Reset password email sent
    if (matchesPath(location, `${PASSWORD_RESET}/api`)) {
      return <EmailSent action={ACTIONS.RESET_PASSWORD} />;
    }
    //Request email to reset your password
    if (matchesPath(location, PASSWORD_RESET) || hasSearchParam(location.search, 'p', PASSWORD_RESET)) {
      return <ResetPassword />;
    }
    //Password has been changed
    if (matchesPath(location, `${PASSWORD_RESET_CONFIRMATION}/api`)) {
      return <PasswordChanged />;
    }
    //Enter new password page
    if (matchesPath(location, PASSWORD_RESET_CONFIRMATION)) {
      //Error - link has expired
      if (domHasElementWithId(ERROR_MESSAGE)) {
        return <ExpiredLink action={ACTIONS.RESET_PASSWORD} />;
      }
      return <EnterNewPassword />;
    }
    //Results for forgotten email page
    if (matchesPath(location, `${FIND_EMAIL}/api`)) {
      //Success - account was found
      if (domHasElementWithId(SUCCESS_MESSAGE)) {
        return <AccountFound />;
      }
      //Error - account was not found
      if (domHasElementWithId(ERROR_MESSAGE)) {
        return <AccountNotFound />;
      }
    }
    //Forgotten email
    if (matchesPath(location, FIND_EMAIL) || hasSearchParam(location.search, 'p', FIND_EMAIL)) {
      return <ForgottenEmail />;
    }
    //Account activated from Self Registration
    if (matchesPath(location, SIGNUP_CONFIRMATION)) {
      //Error - link has expired
      if (domHasElementWithId(ERROR_MESSAGE)) {
        return <ExpiredLink action={ACTIONS.SIGNUP} />;
      }
      return <AccountActivated />;
    }
    //Account activated from Aided Registration
    if (matchesPath(location, `${SIGNUP_INVITATION}/api`)) {
      return <AccountActivated />;
    }
    //Activate account from Aided Registration
    if (matchesPath(location, SIGNUP_INVITATION)) {
      //Error - link has expired
      if (domHasElementWithId(ERROR_MESSAGE)) {
        return <ExpiredLink action={ACTIONS.SIGNUP} />;
      }
      return <ActivateAccount />;
    }
    //default
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