
import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { JSDOM } from "jsdom";

import Login from './Login';

it('renders without crashing', () => {
    shallow(<Login />);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<Login />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

describe('when submitting the form', () => {

    describe('when all details have not been set', () => {

        it('sets showErrors to true and does not call submit function', () => {
            const wrapper = mount(<Login />);
            const form = wrapper.find('#customForm');
            const setDataAndSubmitSpy = jest.spyOn(wrapper.instance(), 'setDataAndSubmit');

            form.simulate('submit');

            expect(wrapper.state().showErrors).toBe(true);
            expect(setDataAndSubmitSpy).not.toHaveBeenCalled();

        });

    });

    describe('when all details have been set', () => {

        let wrapper;
        let form;
        let setDataAndSubmitSpy;
        let b2cSubmitSpy;

        beforeEach(() => {
            //mount page with values in state for all required fields
            wrapper = mount(<Login />);

            wrapper.setState({
                email: 'a',
                password: 'a'
            });

            //get form element to simulate submit in tests
            form = wrapper.find('#customForm');

            //spy on the page submit button
            setDataAndSubmitSpy = jest.spyOn(wrapper.instance(), 'setDataAndSubmit');

            //create some DOM elements to simulate the content added by B2C
            const dom = new JSDOM();
            global.document = dom.window.document;

            //add the B2C submit button at least and spy on its click event
            let b2cSubmitElem = global.document.createElement('button');
            b2cSubmitElem.id = 'next';
            global.document.body.appendChild(b2cSubmitElem);

            //spy on b2c submit button click
            b2cSubmitSpy = jest.spyOn(global.document.getElementById('next'), 'click');
        });

        describe('when not all B2C DOM elements are present', () => {

            it('sets showErrors to false and calls submit function but does not call B2C submit', () => {

                form.simulate('submit');

                expect(setDataAndSubmitSpy).toHaveBeenCalled();
                expect(wrapper.state().showErrors).toBe(false);
                expect(b2cSubmitSpy).not.toHaveBeenCalled();
            });
        });

        describe('when all B2C DOM elements are present', () => {

            it('sets showErrors to false and calls submit function and then the B2C submit button click', () => {

                //add B2C content to the DOM
                let b2cElem = global.document.createElement('div');
                b2cElem.innerHTML = `
                <span id='email'></span>
                <span id='password'></span>
            `;
                global.document.body.appendChild(b2cElem);

                form.simulate('submit');

                expect(setDataAndSubmitSpy).toHaveBeenCalled();
                expect(wrapper.state().showErrors).toBe(false);
                expect(b2cSubmitSpy).toHaveBeenCalled();
            });

        });

    });

});
