import { domHasElementWithId, getInnerTextById } from './dom';
import { JSDOM } from "jsdom";

describe('when document is not defined', () => {
    it('domHasElementWithId returns false', () => {
        expect(domHasElementWithId('test_id')).toBe(false);
    });

    it('getInnerTextById returns undefined', () => {
        expect(getInnerTextById('test_id')).toBeUndefined();
    });
});

describe('when document is defined', () => {

    beforeEach(() => {
        const dom = new JSDOM();
        global.document = dom.window.document;
    });

    describe('if element with specified id does not exist', () => {
        it('domHasElementWithId returns false', () => {
            expect(domHasElementWithId('test_id')).toBe(false);
        });

        it('getInnerTextById returns undefined', () => {
            expect(getInnerTextById('test_id')).toBeUndefined();
        });
    });


    describe('if element with specified id exists', () => {

        beforeEach(() => {
            let elem = global.document.createElement('p');
            elem.id = 'test_id';
            elem.innerText = 'sample_text'
            global.document.body.appendChild(elem);
        });

        it('domHasElementWithId returns true', () => {
            expect(domHasElementWithId('test_id')).toBe(true);
        });

        it('getInnerTextById returns its inner text value', () => {
            expect(getInnerTextById('test_id')).toEqual('sample_text');
        });
    });

});