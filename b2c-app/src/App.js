import React from 'react';

import { ACTIONS } from './constants/actions';

import { domHasElementWithId } from './helpers/dom';
import { matchesPath, hasSearchParam } from './helpers/urls';

import Signup from './pages/Signup';
import Login from './pages/Login';
import EmailSent from './pages/EmailSent';
import AccountLocked from './pages/AccountLocked';
import AccountActivated from './pages/AccountActivated';
import ResetPassword from './pages/ResetPassword';
import ForgottenEmail from './pages/ForgottenEmail';
import AccountNotFound from './pages/AccountNotFound';
import AccountFound from './pages/AccountFound';
import PasswordChanged from './pages/PasswordChanged';
import Placeholder from './pages/Placeholder';
import EnterNewPassword from './pages/EnterNewPassword';
import ActivateAccount from './pages/AidedRegistration/ActivateAccount';

import components from './components';

import {
  Switch,
  Route
} from "react-router-dom";

import { withRouter } from "react-router";

class App extends React.Component {

  getComponentByLocation() {
    const { location } = this.props;

    console.log('Current location object:');
    console.log(location);

    try {
      if (document) {
        console.log('API element from B2C:');
        console.log(document.getElementById('api'));
      }
      else {
        console.log('Document still not available');
      }
    }
    catch (e) {
      console.log(e);
    }

    if (matchesPath(location, 'B2C_1A_signin_invitation') || hasSearchParam(location.search, 'p', 'B2C_1A_signin_invitation')) {
      return <Login />;
    }
    if (matchesPath(location, 'B2C_1A_account_signup/api')) {
      return <EmailSent action={ACTIONS.SIGNUP} />;
    }
    if (matchesPath(location, '/signup')) {
      return <Signup />;
    }
    if (matchesPath(location, '/locked')) {
      return <AccountLocked />;
    }
    if (matchesPath(location, 'B2C_1A_passwordreset/api')) {
      return <EmailSent action={ACTIONS.RESET_PASSWORD} />;
    }
    if (matchesPath(location, 'B2C_1A_passwordreset') || hasSearchParam(location.search, 'p', 'B2C_1A_passwordreset')) {
      return <ResetPassword />;
    }
    if (matchesPath(location, '/enter-new-password')) {
      return <EnterNewPassword />;
    }
    if (matchesPath(location, '/password-changed')) {
      return <PasswordChanged />;
    }
    //Results for forgotten email page
    if (matchesPath(location, 'B2C_1A_findEmail/api')) {
      //Success - account was found
      if(domHasElementWithId('successMessage')){
        return <AccountFound />;
      }
      //Error - account was not found
      if(domHasElementWithId('errorMessage')){
        return <AccountNotFound />;
      }
    }
    //Forgotten email
    if (matchesPath(location, 'B2C_1A_findEmail') || hasSearchParam(location.search, 'p', 'B2C_1A_findEmail')) {
      return <ForgottenEmail />;
    }
    //Account activated from Self Registration and Aided Registration
    if (matchesPath(location, 'B2C_1A_signup_confirmation') ||
      matchesPath(location, 'B2C_1A_signup_invitation/api')) {
      return <AccountActivated />;
    }
    //Activate account from Aided Registration
    if (matchesPath(location, 'B2C_1A_signup_invitation')) {
      return <ActivateAccount />;
    }
    //default
    console.log('no matches, loading placeholder');    
    return <Placeholder />;
  }

  render() {

    let component = this.getComponentByLocation();
    console.log('We are going to render the component:');
    console.log(component);

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