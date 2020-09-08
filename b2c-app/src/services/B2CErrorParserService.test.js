import React from 'react';
import components from '../components';
import * as B2CErrorParserService from './B2CErrorParserService';

describe('when parsing an error coming from B2C', () => {

    beforeEach(() => {
        delete window.location;
        global.window.location = {};
    });

    it('does return a paragraph with the passed in error if not in transformation list', () => {
        let testError = 'test_error';
        expect(B2CErrorParserService.parseB2CErrors(testError)).toEqual(<p>{testError}</p>);
    });

    it('does return the configured transformed error message when it matches one', () => {
        let testError = 'ACCOUNT_LOCKED';
        expect(B2CErrorParserService.parseB2CErrors(testError)).toEqual(<components.LockedAccountHelp />);
    });
});