import React from 'react';

class InputField extends React.Component {

    constructor(props) {
        super(props);
        this.defaultErrorMessage = `Enter your ${this.props.errorMessagePlaceholder}`;
        //use additional text for id to avoid conflict with ids from B2C
        this.elementUniqueId = `${this.props.inputId}Custom`;
        this.state = {
            [this.props.inputId]: null,
            errors: {
                [this.props.inputId]: {
                    text: this.defaultErrorMessage,
                    showSummaryText: false,
                    id: this.elementUniqueId
                }
            }
        };
        //get input type to use it to define the input element and its validation
        this.inputType = this.props.type || 'text'; //set to text by default

        this.handleChange = this.handleChange.bind(this);
        this.isValidInput = this.isValidInput.bind(this);

        //initialise visible errors in parent component
        if (this.props.initialiseParentErrors) {
            this.props.initialiseParentErrors(this.state.errors);
        }
    }

    handleChange(e) {
        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
            this.props.onChange({
                [this.props.inputId]: this.isValidInput() ? value : null
            });
        });
    }

    isValidInput() {
        let isValid = true;

        //build new error state with empty value for text
        const newErrorState = { ...this.state.errors }
        newErrorState[this.props.inputId].text = '';

        //now update values if invalid
        //the only validation done by default is check that the input field is not empty
        if (!this.state[this.props.inputId]) {
            isValid = false;
            newErrorState[this.props.inputId].text = this.defaultErrorMessage;
        }

        else if (this.inputType === 'email') {
            // eslint-disable-next-line
            const pattern = /^[a-zA-Z0-9.!#$%&amp;'^_`{}~+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!this.state[this.props.inputId].match(pattern)) {
                isValid = false;
                newErrorState[this.props.inputId].text = `Invalid ${this.props.errorMessagePlaceholder}`;
            }
        }

        this.setState({ errors: newErrorState }, () => {
            //call parent to update its state
            this.props.updateParentErrors(this.state.errors);
        });

        return isValid;
    }

    render() {

        const { visibleErrors, showErrors } = this.props;

        let inputErrorElement;
        if (showErrors && visibleErrors[this.props.inputId].text.length > 0)
            inputErrorElement =
                <span id={`${this.elementUniqueId}Error`} className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {visibleErrors[this.props.inputId].text}
                </span>

        let inputHint;
        if (this.props.hint) {
            inputHint =
                <span id={`${this.props.inputId}-hint`} className="govuk-hint">
                    {this.props.hint}
                </span>
        }

        let inputField;
        if (this.inputType === 'email') {
            inputField =
                <input
                    className="govuk-input govuk-!-width-one-half"
                    id={this.elementUniqueId}
                    name={this.props.inputId}
                    type={this.inputType}
                    spellCheck='false'
                    autoComplete='email'
                    onChange={this.handleChange}
                    noValidate
                />
        }
        else {
            inputField =
                <input
                    className="govuk-input govuk-!-width-one-half"
                    id={this.elementUniqueId}
                    name={this.props.inputId}
                    type={this.inputType}
                    onChange={this.handleChange}
                    noValidate
                />
        }

        return (

            <div className={`govuk-form-group ${showErrors && visibleErrors[this.props.inputId].text.length > 0 ? "govuk-form-group--error" : ""}`}>
                <label className="govuk-label" htmlFor={this.elementUniqueId}>
                    {this.props.inputLabel}
                </label>
                {inputErrorElement}
                {inputHint}
                {inputField}
            </div>
        )
    }
}

export default InputField;