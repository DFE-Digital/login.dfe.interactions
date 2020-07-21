
import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { ACTIONS } from '../constants/actions';
import { JSDOM } from "jsdom";

import ExpiredLinkWithResendEmail from './ExpiredLinkWithResendEmail';

it('renders without crashing', () => {
    shallow(<ExpiredLinkWithResendEmail />);
});

it('renders correctly without action passed in', () => {
    const tree = renderer
        .create(<ExpiredLinkWithResendEmail />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with action ACTIONS.SIGNUP passed in', () => {
    const tree = renderer
        .create(<ExpiredLinkWithResendEmail action={ACTIONS.SIGNUP} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with action ACTIONS.CHANGE_EMAIL passed in', () => {
    const tree = renderer
        .create(<ExpiredLinkWithResendEmail action={ACTIONS.CHANGE_EMAIL} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

describe('when clicking the resend button (submitting custom form)', () => {

    let wrapper;
    let form;
    let b2cSubmitSpy;

    beforeEach(() => {
        //mount page with values in state for all required fields
        wrapper = mount(<ExpiredLinkWithResendEmail />);

        //get form element to simulate submit in tests
        form = wrapper.find('#customForm');

        //create custom DOM that we will use to simulate the content added by B2C
        const dom = new JSDOM();
        global.document = dom.window.document;

    });

    describe('when all B2C DOM elements are present', () => {

        it('calls the B2C submit button click', () => {

            //add the B2C submit button at least and spy on its click event
            let b2cSubmitElem = global.document.createElement('button');
            b2cSubmitElem.id = 'continue';
            global.document.body.appendChild(b2cSubmitElem);

            //spy on b2c submit button click
            b2cSubmitSpy = jest.spyOn(global.document.getElementById('continue'), 'click');

            form.simulate('submit');
            expect(b2cSubmitSpy).toHaveBeenCalled();
        });
    });



});