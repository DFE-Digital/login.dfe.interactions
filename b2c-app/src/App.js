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

    const ERROR_MESSAGE = 'errorMessage';
    const SUCCESS_MESSAGE = 'successMessage';

    //Login page
    if (matchesPath(location, 'B2C_1A_signin_invitation') || hasSearchParam(location.search, 'p', 'B2C_1A_signin_invitation')) {
      return <Login />;
    }
    //Activation email sent after sign up
    if (matchesPath(location, 'B2C_1A_account_signup/api')) {
      return <EmailSent action={ACTIONS.SIGNUP} />;
    }
    //Sign up page
    if (matchesPath(location, 'B2C_1A_account_signup') || hasSearchParam(location.search, 'p', 'B2C_1A_account_signup')) {
      return <Signup />;
    }
    //Reset password email sent
    if (matchesPath(location, 'B2C_1A_passwordreset/api')) {
      return <EmailSent action={ACTIONS.RESET_PASSWORD} />;
    }
    //Request email to reset your password
    if (matchesPath(location, 'B2C_1A_passwordreset') || hasSearchParam(location.search, 'p', 'B2C_1A_passwordreset')) {
      return <ResetPassword />;
    }
    //Password has been changed
    if (matchesPath(location, '/B2C_1A_passwordResetConformation/api')) {
      return <PasswordChanged />;
    }
    //Enter new password page
    if (matchesPath(location, 'B2C_1A_passwordResetConformation')) {
      //Error - link has expired
      if (domHasElementWithId(ERROR_MESSAGE)) {
        return <ExpiredLink action={ACTIONS.RESET_PASSWORD} />;
      }
      return <EnterNewPassword />;
    }
    //Results for forgotten email page
    if (matchesPath(location, 'B2C_1A_findEmail/api')) {
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
    if (matchesPath(location, 'B2C_1A_findEmail') || hasSearchParam(location.search, 'p', 'B2C_1A_findEmail')) {
      return <ForgottenEmail />;
    }
    //Account activated from Self Registration
    if (matchesPath(location, 'B2C_1A_signup_confirmation')) {
      //Error - link has expired
      if (domHasElementWithId(ERROR_MESSAGE)) {
        return <ExpiredLink action={ACTIONS.SIGNUP} />;
      }
      return <AccountActivated />;
    }
    //Account activated from Aided Registration
    if (matchesPath(location, 'B2C_1A_signup_invitation/api')) {
      return <AccountActivated />;
    }
    //Activate account from Aided Registration
    if (matchesPath(location, 'B2C_1A_signup_invitation')) {
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