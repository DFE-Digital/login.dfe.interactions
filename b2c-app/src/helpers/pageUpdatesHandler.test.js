import { onChange } from './pageUpdatesHandler';

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