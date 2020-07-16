import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

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