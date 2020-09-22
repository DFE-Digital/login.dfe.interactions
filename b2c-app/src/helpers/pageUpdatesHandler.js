export function onChange(valuesToSet) {
    //set input values in state
    Object.keys(valuesToSet).forEach((key) => {
        this.setState({ [key]: valuesToSet[key] });
    });
}