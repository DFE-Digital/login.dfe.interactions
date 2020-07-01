export function onError(errors) {
    Object.keys(this.state.errors).forEach((key) => {
        if (errors && Array.isArray(errors)) {
            const found = errors.some(el => {
                return el.id === this.state.errors[key].id;
            });
            if (!found) {
                errors.push(this.state.errors[key]);
            }
        }
    });
}

export function onChange(valuesToSet) {
    //set input values in state
    Object.keys(valuesToSet).forEach((key) => {
        this.setState({ [key]: valuesToSet[key] });
    });
}