
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import { JSDOM } from "jsdom";

import { POLICIES } from './constants/policies';
import App from './App';

const ERROR_MESSAGE = 'errorMessage';
const SUCCESS_MESSAGE = 'successMessage';
const CONFIRMATION_MESSAGE = 'confirmationMessage';

const renderApp = () => {
    return renderer
        .create(
            <Router>
                <App />
            </Router>
        ).toJSON();
}

describe('when location is not set', () => {

    it('renders without crashing', () => {
        shallow(
            <Router>
                <App />
            </Router>
        );
    });

    it('renders correctly', () => {
        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

});

describe('when location is set', () => {

    beforeEach(() => {
        delete window.location;
        window.location = {
            pathname: '/test_path/',
        };
        const dom = new JSDOM();
        global.document = dom.window.document;
        global.document.body.innerHTML = '';
    });

    it('renders without crashing', () => {
        shallow(
            <Router>
                <App />
            </Router>
        );
    });

    it('renders correctly', () => {
        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    describe('-- login', () => {

        it('renders correctly when URL contains policy name', () => {

            //set URL
            window.location = {
                pathname: `/${POLICIES.SIGNIN_INVITATION}/`,
            };

            const tree = renderApp();
            expect(tree).toMatchSnapshot();
        });

        it('renders correctly when query params contain this policy', () => {

            //set query params
            window.location.search = `?p=${POLICIES.SIGNIN_INVITATION}&param=value`;

            const tree = renderApp();
            expect(tree).toMatchSnapshot();
        });
    });

    describe('-- self registration', () => {

        describe('-- sign up', () => {

            it('renders correctly when URL contains POLICIES.ACCOUNT_SIGNUP/', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.ACCOUNT_SIGNUP}/`,
                };

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });

            it('renders correctly when query params contain POLICIES.ACCOUNT_SIGNUP', () => {

                //set query params
                window.location.search = `?p=${POLICIES.ACCOUNT_SIGNUP}&param=value`;

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- email sent', () => {

            it('renders correctly when URL contains POLICIES.ACCOUNT_SIGNUP/api/', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.ACCOUNT_SIGNUP}/api/`,
                };

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });

            it('renders correctly when URL contains POLICIES.SIGNUP_CONFIRMATION and DOM has success element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.SIGNUP_CONFIRMATION}/`,
                };

                //add success element to DOM
                let elem = global.document.createElement('p');
                elem.id = SUCCESS_MESSAGE;
                global.document.body.appendChild(elem);

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });

        });

        describe('-- expired link', () => {

            it('renders correctly when URL contains POLICIES.SIGNUP_CONFIRMATION and DOM has error element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.SIGNUP_CONFIRMATION}/`,
                };

                //add error element to DOM
                let elem = global.document.createElement('p');
                elem.id = ERROR_MESSAGE;
                global.document.body.appendChild(elem);

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- account activated', () => {

            it('renders correctly when URL contains POLICIES.SIGNUP_CONFIRMATION and DOM has error element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.SIGNUP_CONFIRMATION}/`,
                };

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });
    });

    describe('-- aided registration', () => {

        describe('-- activate account', () => {

            it('renders correctly when URL contains POLICIES.SIGNUP_INVITATION', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.SIGNUP_INVITATION}/`,
                };

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- expired link', () => {

            it('renders correctly when URL contains POLICIES.SIGNUP_INVITATION and DOM has error element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.SIGNUP_INVITATION}/`,
                };

                //add error element to DOM
                let elem = global.document.createElement('p');
                elem.id = ERROR_MESSAGE;
                global.document.body.appendChild(elem);

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- email sent', () => {

            it('renders correctly when URL contains POLICIES.SIGNUP_INVITATION/api/ and DOM has success element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.SIGNUP_INVITATION}/api/`,
                };

                //add success element to DOM
                let elem = global.document.createElement('p');
                elem.id = SUCCESS_MESSAGE;
                global.document.body.appendChild(elem);

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- account activated', () => {

            it('renders correctly when URL contains POLICIES.SIGNUP_INVITATION/api/ and DOM has confirmation element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.SIGNUP_INVITATION}/api/`,
                };

                //add confirmation element to DOM
                let elem = global.document.createElement('p');
                elem.id = CONFIRMATION_MESSAGE;
                global.document.body.appendChild(elem);

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });
    });

    describe('-- reset password', () => {

        describe('-- request email to reset password', () => {

            it('renders correctly when URL contains POLICIES.PASSWORD_RESET/', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.PASSWORD_RESET}/`,
                };

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });

            it('renders correctly when query params contain POLICIES.PASSWORD_RESET', () => {

                //set query params
                window.location.search = `?p=${POLICIES.PASSWORD_RESET}&param=value`;

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- email sent', () => {

            it('renders correctly when URL contains POLICIES.PASSWORD_RESET/api/', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.PASSWORD_RESET}/api/`,
                };

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- expired link', () => {

            it('renders correctly when URL contains POLICIES.PASSWORD_RESET_CONFIRMATION and DOM has error element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.PASSWORD_RESET_CONFIRMATION}/`,
                };

                //add error element to DOM
                let elem = global.document.createElement('p');
                elem.id = ERROR_MESSAGE;
                global.document.body.appendChild(elem);

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- enter new password', () => {

            it('renders correctly when URL contains POLICIES.PASSWORD_RESET_CONFIRMATION and DOM has no error element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.PASSWORD_RESET_CONFIRMATION}/`,
                };

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- password changed', () => {

            it('renders correctly when URL contains POLICIES.PASSWORD_RESET_CONFIRMATION/api/', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.PASSWORD_RESET_CONFIRMATION}/api/`,
                };

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });
    });

    describe('-- forgotten email', () => {

        describe('Find email', () => {

            it('renders correctly when URL contains POLICIES.FIND_EMAIL/', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.FIND_EMAIL}/`,
                };

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });

            it('renders correctly when query params contain POLICIES.FIND_EMAIL', () => {

                //set query params
                window.location.search = `?p=${POLICIES.FIND_EMAIL}&param=value`;

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- account found', () => {

            it('renders correctly when URL contains POLICIES.FIND_EMAIL/api/ and DOM has success element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.FIND_EMAIL}/api/`,
                };

                //add success element to DOM
                let elem = global.document.createElement('p');
                elem.id = SUCCESS_MESSAGE;
                global.document.body.appendChild(elem);

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- account not found', () => {

            it('renders correctly when URL contains POLICIES.FIND_EMAIL/api/ and DOM has error element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.FIND_EMAIL}/api/`,
                };

                //add error element to DOM
                let elem = global.document.createElement('p');
                elem.id = ERROR_MESSAGE;
                global.document.body.appendChild(elem);

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });
    });

    describe('-- change email', () => {

        describe('-- expired link', () => {

            it('renders correctly when URL contains POLICIES.CHANGE_EMAIL and DOM has error element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.CHANGE_EMAIL}/`,
                };

                //add error element to DOM
                let elem = global.document.createElement('p');
                elem.id = ERROR_MESSAGE;
                global.document.body.appendChild(elem);

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- email sent', () => {

            it('renders correctly when URL contains POLICIES.CHANGE_EMAIL/api/', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.CHANGE_EMAIL}/api/`,
                };

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });

        describe('-- new email activated', () => {

            it('renders correctly when URL contains POLICIES.CHANGE_EMAIL and DOM has no error element', () => {

                //set URL
                window.location = {
                    pathname: `/${POLICIES.CHANGE_EMAIL}/`,
                };

                const tree = renderApp();
                expect(tree).toMatchSnapshot();
            });
        });
    });

});