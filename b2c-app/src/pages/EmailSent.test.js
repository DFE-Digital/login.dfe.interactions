import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { POLICIES } from '../constants/policies';

import EmailSent from './EmailSent';

it('renders without crashing', () => {
    shallow(<EmailSent />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<EmailSent />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

describe('when policy is POLICIES.SIGNUP_INVITATION', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent policy={POLICIES.SIGNUP_INVITATION} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('when policy is POLICIES.ACCOUNT_SIGNUP', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent policy={POLICIES.ACCOUNT_SIGNUP} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('when policy is POLICIES.SIGNUP_CONFIRMATION', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent policy={POLICIES.SIGNUP_CONFIRMATION} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('when policy is POLICIES.SIGNIN_INVITATION', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent policy={POLICIES.SIGNIN_INVITATION} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('when policy is POLICIES.CHANGE_EMAIL', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent policy={POLICIES.CHANGE_EMAIL} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('when policy is POLICIES.RESEND_EMAIL', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent policy={POLICIES.RESEND_EMAIL} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('when policy is POLICIES.PASSWORD_RESET', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent policy={POLICIES.PASSWORD_RESET} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('when policy is POLICIES.PASSWORD_RESET_CONFIRMATION', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent policy={POLICIES.PASSWORD_RESET_CONFIRMATION} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});