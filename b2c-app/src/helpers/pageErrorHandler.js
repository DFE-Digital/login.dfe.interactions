export function updateVisibleErrorsInState() {
    //build new error state to update visible errors on submit (and not before)
    let newVisibleErrorState = {};

    //do this for each component we have errors for
    Object.keys(this.state.childrenErrors).forEach((key) => {
        //make current error be the visible error now
        newVisibleErrorState[key] = { ...this.state.childrenErrors[key] };
    });

    this.setState({ visibleErrors: newVisibleErrorState });
}

export function initialiseErrorsInState(childErrors) {
    let initialVisibleErrors = {};
    Object.keys(childErrors).forEach((key) => {
        //initialise visible errors empty
        initialVisibleErrors[key] = { ...childErrors[key] };
        initialVisibleErrors[key].text = '';
    });

    //add errors sent from a child component to the full list of visible errors for a page
    //and initialise all children errors for later use
    this.setState({
        visibleErrors: initialVisibleErrors,
        childrenErrors: { ...this.state.childrenErrors, ...childErrors }
    });
}

export function updateCurrentErrorsInState(childErrors) {
    //add errors sent from a child component to the full list of current errors for this page
    this.setState({ childrenErrors: { ...this.state.childrenErrors, ...childErrors } });
}