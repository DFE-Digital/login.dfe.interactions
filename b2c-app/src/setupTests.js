require('regenerator-runtime/runtime');
import '@testing-library/jest-dom/extend-expect';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import MutationObserver from 'mutation-observer';
global.MutationObserver = MutationObserver;
