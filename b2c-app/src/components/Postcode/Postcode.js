import React from 'react';

class Postcode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            postcode: null,
            errors: {
                postcode: {
                    text: 'Enter your postcode',
                    showSummaryText: false,
                    id: 'postcodeCustom'
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.isValidPostcode = this.isValidPostcode.bind(this);

        //initialise visible errors in parent component
        if (this.props.initialiseParentErrors) {
            this.props.initialiseParentErrors(this.state.errors);
        }
    }

    handleChange(e) {
        e.preventDefault();

        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
            this.props.onChange({
                postcode: this.isValidPostcode() ? this.state.postcode : null
            });
        });
    }

    isValidPostcode() {
        let isValid = true;
        let postcode = this.state.postcode;

        //build new error state with empty value for text
        const newErrorState = { ...this.state.errors }
        newErrorState.postcode.text = '';

        //now update value for the text if invalid

        if (!postcode) {
            isValid = false;
            newErrorState.postcode.text = 'Enter your postcode';
        }
        else if (!postcode.match(/^([Gg][Ii][Rr]\s?0[Aa]{2})|^((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$/)) {
            isValid = false;
            newErrorState.postcode.text = 'Enter a valid postcode';
        } else if (postcode.indexOf(' ') === -1) {
            //we have a valid postcode but it does not have space in it, so we add it (4th character from the end)
            const indexToAddSpace = postcode.length - 3;
            postcode = postcode.substring(0, indexToAddSpace) + ' ' + postcode.substring(indexToAddSpace);
            //update state in component and parent
            this.setState({ postcode: postcode }, () => {
                this.props.onChange({
                    postcode: postcode
                });
            });
        }

        this.setState({ errors: newErrorState }, () => {
            //call parent to update its state
            this.props.updateParentErrors(this.state.errors);
        });

        return isValid;
    }

    render() {

        const { visibleErrors, showErrors } = this.props;

        let postcodeErrorElement;
        if (showErrors && visibleErrors.postcode.text.length > 0) {
            postcodeErrorElement =
                <span id="postcodeError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {visibleErrors.postcode.text}
                </span>
        }

        return (
            <div className={`govuk-form-group ${showErrors && visibleErrors.postcode.text.length > 0 ? "govuk-form-group--error" : ""}`}>
                <label className="govuk-label" htmlFor="postcodeCustom">
                    Enter your postcode
                </label>
                {postcodeErrorElement}
                <span id="postcode-hint" className="govuk-hint">
                    For example, SW1A 1AA
                </span>
                <input name="postcode"
                    className="govuk-input govuk-input--width-10"
                    id="postcodeCustom"
                    type="text"
                    value={this.state.postcode || ''}
                    onChange={this.handleChange}
                    noValidate />
            </div>
        )
    }
}

export default Postcode;