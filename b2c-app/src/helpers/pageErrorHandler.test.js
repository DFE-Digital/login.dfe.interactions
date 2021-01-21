import { updateVisibleErrorsInState, initialiseErrorsInContainer, updateCurrentErrorsInState } from './pageErrorHandler';

//mocked "this" including the state object that contains errors coming from component
let mockedThis;

beforeEach(() => {
    mockedThis = {
        setState: jest.fn()
    };
});

describe('when calling updateVisibleErrorsInState', () => {

    it('sets children errors as visible errors to update UI', () => {

        //function that we will use, binding to the previously mocked "this"
        let updateVisibleErrorsInStateBound = updateVisibleErrorsInState.bind(mockedThis);

        let errors = {
            test1: {
                text: '111'
            }
        };

        mockedThis.childrenErrors = errors;

        updateVisibleErrorsInStateBound();
        expect(mockedThis.setState).toHaveBeenCalledWith({ visibleErrors: errors });

    });

});


describe('when calling initialiseErrorsInContainer', () => {

    describe('and there were no errors in the container already', () => {

        it('sets passed in errors', () => {

            //function that we will use, binding to the previously mocked "this"
            let initialiseErrorsInContainerBound = initialiseErrorsInContainer.bind(mockedThis);

            let errors = {
                test1: {
                    text: '111'
                }
            };

            initialiseErrorsInContainerBound(errors);
            expect(mockedThis.childrenErrors).toStrictEqual(errors);

        });

    });

    describe('and there were errors already in the container', () => {

        it('appends passed in errors', () => {

            //function that we will use, binding to the previously mocked "this"
            let initialiseErrorsInContainerBound = initialiseErrorsInContainer.bind(mockedThis);

            let errors = {
                test1: {
                    text: '111'
                }
            };

            mockedThis.childrenErrors = {
                test2: {
                    text: '222'
                }
            }

            initialiseErrorsInContainerBound(errors);
            expect(mockedThis.childrenErrors).toStrictEqual({ ...errors, ...mockedThis.childrenErrors });

        });

    });

});


describe('when calling updateCurrentErrorsInState', () => {

    describe('and there were no errors in the state already', () => {

        beforeEach(() => {
            mockedThis.state = {
                childrenErrors: {}
            }
        });

        it('sets passed in errors', () => {

            //function that we will use, binding to the previously mocked "this"
            let updateCurrentErrorsInStateBound = updateCurrentErrorsInState.bind(mockedThis);

            let errors = {
                test1: {
                    text: '111'
                }
            };

            updateCurrentErrorsInStateBound(errors);
            expect(mockedThis.setState).toHaveBeenCalledWith({ childrenErrors: errors });

        });

    });

    describe('and there were errors already in the state', () => {

        beforeEach(() => {
            mockedThis.state = {
                childrenErrors: {
                    test2: {
                        text: '222'
                    }
                }
            }
        });

        it('appends passed in errors', () => {

            //function that we will use, binding to the previously mocked "this"
            let updateCurrentErrorsInStateBound = updateCurrentErrorsInState.bind(mockedThis);

            let errors = {
                test1: {
                    text: '111'
                }
            };

            updateCurrentErrorsInStateBound(errors);
            expect(mockedThis.setState).toHaveBeenCalledWith({ childrenErrors: { ...errors, ...mockedThis.state.childrenErrors } });

        });

    });

});