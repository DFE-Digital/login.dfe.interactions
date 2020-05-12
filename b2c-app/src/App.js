import React from 'react';
//import './App.scss';
import Signup from './pages/Signup';
import Login from './pages/Login';
import EmailSent from './pages/EmailSent';
import LockedAccount from './pages/LockedAccount';
import AccountActivated from './pages/AccountActivated';

import components from './components';

import {
  Switch,
  Route
} from "react-router-dom";

export default class App extends React.Component {

  shouldComponentUpdate() {
    return false;
  };

  componentDidMount(){

    // manipulate the DOM so that we can find all page level errors and put them in the same place, potentially
    // outside the B2C container
    this._govUkPageErrorElement = document.createElement('div');
    this._govUkPageErrorElement.innerHTML = `
      <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
        <h2 class="govuk-error-summary__title" id="error-summary-title">
          There is a problem
        </h2>
        <div class="govuk-error-summary__body">
          <ul id="errorSummaryItems" class="govuk-list govuk-error-summary__list">
            
          </ul>
        </div>
      </div>
      `;

    //get all page level error elements
    this._pageErrors = document.getElementsByClassName('error pageLevel');

    //find out how many of these errors are visible
    let numVisibleItems = Array.from(this._pageErrors).filter(function(item){
      return item.offsetParent !== null;
    }).length;

    //only add the error summary if there is at least one error visible
    // if(numVisibleItems > 0){

      this._pageLevelErrorContainer = document.getElementById('pageLevelErrorContainer');

      if(this._pageLevelErrorContainer){
        this._pageLevelErrorContainer.appendChild(this._govUkPageErrorElement);
        //get the error summary items container
        this._pageLevelErrorItemsContainer = document.getElementById("errorSummaryItems");
        Array.from(this._pageErrors).forEach( (errorItem) => {   
          //and add each page level error as list items
          let listItem = document.createElement("LI");
          let paragraph = document.createElement("P");
          paragraph.appendChild(errorItem);
          listItem.appendChild(paragraph);
          this._pageLevelErrorItemsContainer.appendChild(listItem);
        });
      }
    // }
  }

  render() {
    return (
      <div className="App" id="app">

        {/* header */}
        <components.Header />

        {/* routing */}
        <div id="routes">
          <Switch>
            <Route exact path="/">
              <header className="App-header">
                <img src="/b2c/images/logo.svg" className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reloadssss.
                  </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                  </a>
              </header>
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/emailsent">
              <EmailSent />
            </Route>
            <Route path="/locked">
              <LockedAccount />
            </Route>
            <Route path="/activated">
              <AccountActivated />
            </Route>
          </Switch>
        </div>

        {/* footer */}
        <components.Footer />

      </div>
    );
  }

}