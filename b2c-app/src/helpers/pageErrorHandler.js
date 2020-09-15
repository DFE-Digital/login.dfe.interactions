export function updateVisibleErrorsInState() {
    //build new error state to update visible errors on submit (and not before)
    let newVisibleErrorState = {};

    //do this for each component we have errors for
    Object.keys(this.childrenErrors).forEach((key) => {
        //make current error be the visible error now
        newVisibleErrorState[key] = { ...this.childrenErrors[key] };
    });

    this.setState({ visibleErrors: newVisibleErrorState });
}

export function initialiseErrorsInContainer(childErrors) {
    //append errors
    this.childrenErrors = { ...this.childrenErrors, ...childErrors };
}

export function updateCurrentErrorsInState(childErrors) {
    //add errors sent from a child component to the full list of current errors for this page
    this.setState({ childrenErrors: { ...this.state.childrenErrors, ...childErrors } });
}