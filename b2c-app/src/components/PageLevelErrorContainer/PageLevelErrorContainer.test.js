import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.PageLevelErrorContainer />);
});

it('renders correctly without props', () => {
    const tree = renderer
        .create(<components.PageLevelErrorContainer />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

describe('when there are errors', () => {

    const errorItems = [
        {
            text: 'test 1'
        },
        {
            id: 'id2',
            text: 'test 2'
        }
    ];

    it('renders correctly', () => {

        const tree = renderer
            .create(<components.PageLevelErrorContainer errorItems={errorItems} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly with the optional error summary', () => {

        errorItems.push(
            {
                text: 'test 3',
                showSummaryText: true
            }
        )

        const summaryTextContent = <p>error summary</p>

        const tree = renderer
            .create(<components.PageLevelErrorContainer errorItems={errorItems} summaryTextContent={summaryTextContent} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('when there are B2C errors', () => {

    const b2cErrors = ['error 1', 'error 2'];

    it('renders correctly', () => {
        const tree = renderer
            .create(<components.PageLevelErrorContainer showB2CErrors={true} />);
        expect(tree.toJSON()).toMatchSnapshot();

        //add B2C errors
        tree.root.instance.setState({ b2cErrors: b2cErrors });

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders correctly with showB2CErrors set to false', () => {
        const tree = renderer
            .create(<components.PageLevelErrorContainer showB2CErrors={false} />);
        expect(tree.toJSON()).toMatchSnapshot();

        //add B2C errors
        tree.root.instance.setState({ b2cErrors: b2cErrors });

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('sets the errors added by B2C to the state in the mutation callback', () => {

        //prepare mutation data to simulate adding/removing B2C errors
        const errorElement = document.createElement('div');
        errorElement.classList.add('error');
        errorElement.style.display = 'none';
        document.body.appendChild(errorElement);

        //set mutation list to simulate B2C showing or hiding errors
        const b2cErrorMutations = [
            {
                target: errorElement
            }
        ];
        let b2cErrorMutationList = b2cErrorMutations[Symbol.iterator]();

        //Mount spinner
        const wrapper = mount(<components.PageLevelErrorContainer />);

        //b2c errors is an empty array initially
        expect(wrapper.state().b2cErrors.length).toEqual(0);

        //call mutation callback, error does not have pageLevel class so there are no errors to add
        wrapper.instance().pageLevelErrorCallback(b2cErrorMutationList);
        //check b2cErrors is still empty
        expect(wrapper.state().b2cErrors.length).toEqual(0);

        //add pageLevel class to error, still display: 'none'
        b2cErrorMutationList = b2cErrorMutations[Symbol.iterator]();
        errorElement.classList.add('pageLevel');
        //call mutation callback, error has display none so still no errors to add
        wrapper.instance().pageLevelErrorCallback(b2cErrorMutationList);
        //check b2cErrors is still empty
        expect(wrapper.state().b2cErrors.length).toEqual(0);

        //set error as visible
        errorElement.style.display = 'block';
        b2cErrorMutationList = b2cErrorMutations[Symbol.iterator]();
        //call mutation callback
        wrapper.instance().pageLevelErrorCallback(b2cErrorMutationList);
        //check b2cErrors has one item now
        expect(wrapper.state().b2cErrors.length).toEqual(1);

        //set display: 'none' again, error should be removed
        errorElement.style.display = 'none';
        b2cErrorMutationList = b2cErrorMutations[Symbol.iterator]();
        //call mutation callback
        wrapper.instance().pageLevelErrorCallback(b2cErrorMutationList);
        //check b2cErrors has no items
        expect(wrapper.state().b2cErrors.length).toEqual(0);
    });
});