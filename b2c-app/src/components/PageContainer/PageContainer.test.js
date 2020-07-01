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

it('renders correctly with props to setup the page as one column', () => {

    const pageConfig = {
        title: "test"
    };

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

    const columns = [
        {
            header: pageConfig.title,
            aboveFormContent: content,
            formContent: formContent,
            belowFormContent: belowFormContent
        }
    ];

    const tree = renderer
        .create(<components.PageContainer pageConfig={pageConfig} columns={columns} />)
        .toJSON();
    expect(tree).toMatchSnapshot();

    //check page title has been set
    expect(global.window.document.title).toBe(`${pageConfig.title} | National Careers Service`)
});

it('renders correctly with props to setup the page as two columns', () => {

    const pageConfig = {
        title: "test"
    };

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

    const columns = [
        {
            header: 'header 1',
            aboveFormContent: content,
            formContent: formContent,
            belowFormContent: belowFormContent
        },
        {
            header: 'header 2',
            aboveFormContent: content,
            formContent: formContent,
            belowFormContent: belowFormContent
        }
    ];

    const tree = renderer
        .create(<components.PageContainer pageConfig={pageConfig} columns={columns} />)
        .toJSON();
    expect(tree).toMatchSnapshot();

    //check page title has been set
    expect(global.window.document.title).toBe(`${pageConfig.title} | National Careers Service`)
});