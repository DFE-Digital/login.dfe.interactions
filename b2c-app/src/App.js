import React from 'react';

import * as QueryParamsService from './services/QueryParamsService';

import { ACTIONS } from './constants/actions';
import { POLICIES } from './constants/policies';

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
import ExpiredLinkWithResendEmail from './pages/ExpiredLinkWithResendEmail';

import components from './components';

import {
  Switch,
  Route
} from "react-router-dom";

import { withRouter } from "react-router";



/**
 * Current routes for each flow:
 * 
 * * Login:
 *    URL or query params contain POLICIES.SIGNIN_INVITATION
 *
 * * Self registration:
 *    Sign up:
 *      URL or query params contain POLICIES.ACCOUNT_SIGNUP (without /api)
 *    Email sent:
 *      URL contains POLICIES.ACCOUNT_SIGNUP/api
 *        OR
 *      URL contains POLICIES.SIGNUP_CONFIRMATION and DOM has success element (comes from expired link page)
 *    Expired link:
 *      URL contains POLICIES.SIGNUP_CONFIRMATION and DOM has error element
 *    Account activated:
 *      URL contains POLICIES.SIGNUP_CONFIRMATION and DOM has no success element and no error element

 * 
 * * Aided registration:
 *    Activate account:
 *      URL contains POLICIES.SIGNUP_INVITATION (without /api) and DOM has no error element
 *    Expired link:
 *      URL contains POLICIES.SIGNUP_INVITATION (without /api) and DOM has error element
 *    Email sent:
 *      URL contains POLICIES.SIGNUP_INVITATION/api and DOM has success element
 *    Account activated:
 *      URL contains POLICIES.SIGNUP_INVITATION/api and DOM has confirmation element
 * 
 * 
 * * Reset password:
 *    Request email to reset password:
 *      URL or query params contain POLICIES.PASSWORD_RESET (without /api)
 *    Email sent:
 *      URL contains POLICIES.PASSWORD_RESET/api
 *    Expired link:
 *      URL contains POLICIES.PASSWORD_RESET_CONFIRMATION (without /api) and DOM has error element
 *    Enter new password page:
 *      URL contains POLICIES.PASSWORD_RESET_CONFIRMATION (without /api) and DOM has no error element
 *    Password changed:
 *      URL contains POLICIES.PASSWORD_RESET_CONFIRMATION}/api
 * 
 * 
 * * Forgotten email:
 *    URL or query params contain POLICIES.FIND_EMAIL
 * 
 * 
 * * Change email:
 *    Expired link:
 *      URL contains POLICIES.CHANGE_EMAIL (without /api) and DOM has error element
 *    Email sent:
 *      URL contains POLICIES.CHANGE_EMAIL/api
 *    New email activated:
 *      URL contains POLICIES.CHANGE_EMAIL (without /api) and DOM has no error element
 * 
 */

class App extends React.Component {

  componentDidMount() {
    //retrieve query param values and store for later use
    QueryParamsService.init();
  }

  getComponentByLocation() {
    const { location } = this.props;

    //Ids in B2C dom that we will be looking for
    const ERROR_MESSAGE = 'errorMessage';
    const SUCCESS_MESSAGE = 'successMessage';
    const CONFIRMATION_MESSAGE = 'confirmationMessage';

    //Login page
    if (matchesPath(location, POLICIES.SIGNIN_INVITATION) || hasSearchParam(location.search, 'p', POLICIES.SIGNIN_INVITATION)) {
      return <Login />;
    }
    //Self registration - Activation email sent after sign up
    if (matchesPath(location, `${POLICIES.ACCOUNT_SIGNUP}/api`)) {
      return <EmailSent action={ACTIONS.SIGNUP} />;
    }
    //Self registration - Sign up page
    if (matchesPath(location, POLICIES.ACCOUNT_SIGNUP) || hasSearchParam(location.search, 'p', POLICIES.ACCOUNT_SIGNUP)) {
      return <Signup />;
    }
    //Reset password email sent
    if (matchesPath(location, `${POLICIES.PASSWORD_RESET}/api`)) {
      return <EmailSent action={ACTIONS.RESET_PASSWORD} />;
    }
    //Request email to reset your password
    if (matchesPath(location, POLICIES.PASSWORD_RESET) || hasSearchParam(location.search, 'p', POLICIES.PASSWORD_RESET)) {
      return <ResetPassword />;
    }
    //Password has been changed
    if (matchesPath(location, `${POLICIES.PASSWORD_RESET_CONFIRMATION}/api`)) {
      return <PasswordChanged />;
    }
    //Enter new password page
    if (matchesPath(location, POLICIES.PASSWORD_RESET_CONFIRMATION)) {
      //Error - link has expired
      if (domHasElementWithId(ERROR_MESSAGE)) {
        return <ExpiredLink action={ACTIONS.RESET_PASSWORD} />;
      }
      return <EnterNewPassword />;
    }
    //Results for forgotten email page
    if (matchesPath(location, `${POLICIES.FIND_EMAIL}/api`)) {
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
    if (matchesPath(location, POLICIES.FIND_EMAIL) || hasSearchParam(location.search, 'p', POLICIES.FIND_EMAIL)) {
      return <ForgottenEmail />;
    }
    //Self registration - Account activated
    if (matchesPath(location, POLICIES.SIGNUP_CONFIRMATION)) {
      //Success - go to email sent page (from resend activation email)
      if (domHasElementWithId(SUCCESS_MESSAGE)) {
        return <EmailSent action={ACTIONS.SIGNUP} />;
      }
      //Error - link has expired
      else if (domHasElementWithId(ERROR_MESSAGE)) {
        return <ExpiredLinkWithResendEmail action={ACTIONS.SIGNUP} />;
      }
      return <AccountActivated />;
    }
    //Aided registration - Account activated/Email sent
    if (matchesPath(location, `${POLICIES.SIGNUP_INVITATION}/api`)) {
      //Success - go to email sent page (from resend activation email)
      if (domHasElementWithId(SUCCESS_MESSAGE)) {
        return <EmailSent action={ACTIONS.SIGNUP} />;
      }
      if (domHasElementWithId(CONFIRMATION_MESSAGE)) {
        return <AccountActivated />;
      }
    }
    //Aided registration - Activate account
    if (matchesPath(location, POLICIES.SIGNUP_INVITATION)) {
      //Error - link has expired
      if (domHasElementWithId(ERROR_MESSAGE)) {
        return <ExpiredLinkWithResendEmail action={ACTIONS.SIGNUP} />;
      }
      return <ActivateAccount />;
    }
    //Change email address - email sent from expired link page
    if (matchesPath(location, `${POLICIES.CHANGE_EMAIL}/api`)) {
      return <EmailSent action={ACTIONS.CHANGE_EMAIL} />;
    }
    //Change email address
    if (matchesPath(location, POLICIES.CHANGE_EMAIL)) {
      //Error - link has expired
      if (domHasElementWithId(ERROR_MESSAGE)) {
        return <ExpiredLinkWithResendEmail action={ACTIONS.CHANGE_EMAIL} />;
      }
      return <AccountActivated />;
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