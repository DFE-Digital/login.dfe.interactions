import { onChange, onError } from './pageUpdatesHandler';

describe('when calling onError callback', () => {

    //mocked "this" including the state object that contains errors coming from component
    let mockedThis;
    //function that we will use after binding to that mocked "this"
    let onErrorBound;

    beforeEach(() => {
        mockedThis = {
            state: {
                errors: {
                    error_key_1: {
                        id: 'id1'
                    }
                }
            }
        };

        onErrorBound = onError.bind(mockedThis);
    });

    it('adds new error from state.errors if it was not in the passed in array', () => {

        //mock the array that holds all errors
        let mockedErrors = [
            {
                id: 'id2'
            }
        ];

        expect(mockedErrors.length).toBe(1);
        onErrorBound(mockedErrors);
        expect(mockedErrors.length).toBe(2);

    });

    it('does not add any errors from state.errors if they were all already added', () => {

        //mock the array that holds all errors
        let mockedErrors = [
            {
                id: 'id1'
            }
        ];

        expect(mockedErrors.length).toBe(1);
        onErrorBound(mockedErrors);
        expect(mockedErrors.length).toBe(1);
    });
});

describe('when calling onChange callback', () => {

    //mocked "this" including the state object that contains errors coming from component
    let mockedThis;
    //function that we will use after binding to that mocked "this"
    let onChangeBound;

    beforeEach(() => {
        mockedThis = {
            setState: jest.fn()
        };

        onChangeBound = onChange.bind(mockedThis);
    });

    it('this.setState is called once when a value is passed in', () => {

        let values = {
            id1: 'aaa'
        }
        onChangeBound(values);
        expect(mockedThis.setState).toHaveBeenCalledWith({ id1: 'aaa' });
    });

});