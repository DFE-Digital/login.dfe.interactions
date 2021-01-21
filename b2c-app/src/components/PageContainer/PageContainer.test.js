import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import components from '..';

it('renders without crashing', () => {
    shallow(<components.PageContainer />);
});

it('renders correctly without props', () => {
    const tree = renderer
        .create(<components.PageContainer />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with props to setup the page', () => {

    const content =
        <div>
            <p>paragraph 1</p>
            <p>paragraph 2</p>
        </div>

    const formContent = <form></form>

    const belowFormContent =
        <div>
            <p>paragraph 3</p>
        </div>

    const pageConfig = {
        title: "test_title",
        header: "test_header",
        aboveFormContent: content,
        formContent: formContent,
        submitButtonText: 'submit',
        submitHandler: jest.fn(),
        belowFormContent: belowFormContent
    };

    const tree = renderer
        .create(<components.PageContainer pageConfig={pageConfig} />)
        .toJSON();
    expect(tree).toMatchSnapshot();

    //check page title has been set
    expect(global.window.document.title).toBe(`${pageConfig.title} | National Careers Service`)
});