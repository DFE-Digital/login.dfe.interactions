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

describe('when policy is POLICIES.SIGNUP', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent policy={POLICIES.SIGNUP_INVITATION} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('when policy is POLICIES.RESET_PASSWORD', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent policy={POLICIES.PASSWORD_RESET} />)
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