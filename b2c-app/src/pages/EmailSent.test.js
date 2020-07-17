import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { ACTIONS } from '../constants/actions';

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

describe('when action is ACTIONS.SIGNUP', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent action={ACTIONS.SIGNUP} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('when action is ACTIONS.RESET_PASSWORD', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent action={ACTIONS.RESET_PASSWORD} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('when action is ACTIONS.CHANGE_EMAIL', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<EmailSent action={ACTIONS.CHANGE_EMAIL} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});