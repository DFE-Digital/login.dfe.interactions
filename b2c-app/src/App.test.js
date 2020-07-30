
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';

import { POLICIES } from './constants/policies';
import { PAGE_IDS } from './constants/pageIds';
import { QUERY_PARAMS } from './constants/queryParams';

import App from './App';

import * as ServerSideQueryParamsService from './services/ServerSideQueryParamsService';
jest.mock('./services/ServerSideQueryParamsService');

const renderApp = () => {
    return renderer
        .create(
            <Router>
                <App />
            </Router>
        ).toJSON();
}

describe('when page is not set in server side query params', () => {

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

describe('when page is set in server side query params', () => {


    it('renders login page correctly', () => {
        //mock value from query params service
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.LOGIN);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders signup page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.SIGNUP);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders email sent page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.EMAIL_SENT);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders email sent page correctly when policy is Resend Email', () => {
        ServerSideQueryParamsService.getQueryParam.mockImplementation((id) => {
            if (id === QUERY_PARAMS.PAGE) {
                return PAGE_IDS.EMAIL_SENT;
            }
            if (id === QUERY_PARAMS.POLICY) {
                return POLICIES.RESEND_EMAIL;
            }
        });

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders email sent page correctly when policy is Resend Email ad original policy is defined', () => {
        ServerSideQueryParamsService.getQueryParam.mockImplementation((id) => {
            if (id === QUERY_PARAMS.PAGE) {
                return PAGE_IDS.EMAIL_SENT;
            }
            if (id === QUERY_PARAMS.POLICY) {
                return POLICIES.RESEND_EMAIL;
            }
            if (id === QUERY_PARAMS.ORIGINAL_POLICY) {
                return POLICIES.SIGNUP_INVITATION;
            }
        });

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders expired link page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.EXPIRED_LINK);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders expired link (with resend button) page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.EXPIRED_LINK_WITH_RESEND);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders account activated page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.ACCOUNT_ACTIVATED);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders activate account page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.ACTIVATE_ACCOUNT);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders reset password page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.RESET_PASSWORD);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders enter new password page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.ENTER_NEW_PASSWORD);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders password changed page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.PASSWORD_CHANGED);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders forgotten email changed page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.FORGOTTEN_EMAIL);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders account found changed page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.ACCOUNT_FOUND);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders account not found changed page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.ACCOUNT_NOT_FOUND);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders not found page correctly when this page is specified', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.NOT_FOUND);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders resend activation email page correctly', () => {
        ServerSideQueryParamsService.getQueryParam.mockReturnValue(PAGE_IDS.RESEND_ACTIVATION_EMAIL);

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

    it('renders page not page correctly when routing does not find a match', () => {
        //mock value from query params service
        ServerSideQueryParamsService.getQueryParam.mockReturnValue('some_value');

        const tree = renderApp();
        expect(tree).toMatchSnapshot();
    });

});