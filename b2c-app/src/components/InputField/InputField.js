import React from 'react';

import { onError } from '../../helpers/pageUpdatesHandler';

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
                    current: {
                        text: this.defaultErrorMessage,
                        showSummaryText: false
                    },
                    visible: {
                        text: '',
                        showSummaryText: false
                    },
                    id: this.elementUniqueId
                }
            }
        };
        //get input type to use it to define the input element and its validation
        this.inputType = this.props.type || 'text'; //set to text by default

        this.handleChange = this.handleChange.bind(this);
        this.onError = onError.bind(this);
        this.isValidInput = this.isValidInput.bind(this);

        //initialise errors in parent component, which will contain a reference to them
        this.onError(this.props.errors);

        //get reference to errors to keep code cleaner
        this.errors = this.state.errors[this.props.inputId];
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

        //clear errors
        this.errors.current.text = '';

        //the only validation done by default is check that the input field is not empty
        if (!this.state[this.props.inputId]) {
            isValid = false;
            this.errors.current.text = this.defaultErrorMessage;
        }

        else if (this.inputType === 'email') {
            // eslint-disable-next-line
            const pattern = /[A-Za-z0-9_\-\+\/{\t\n\r}#$%^\\&\[\]*=()|?'~`! :]+([.][A-Za-z0-9_\-\+\/{\t\n\r}#$%^\\&\[\]*=()|?'~`! :]+)*@[A-Za-z0-9\[\]:]+([.-][A-Za-z0-9\[\]:]+)*\.[A-Za-z0-9\[\]:]+([-.][A-Za-z0-9\[\]:]+)*/;
            if (!this.state[this.props.inputId].match(pattern)) {
                isValid = false;
                this.errors.current.text = `Invalid ${this.props.errorMessagePlaceholder}`;
            }
        }

        this.setState({ errors: this.errors });

        return isValid;
    }

    render() {

        const inputErrorElement = this.props.showErrors && this.errors.visible.text.length > 0 ?
            (
                <span id="inputError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {this.errors.visible.text}
                </span>
            ) :
            null;

        const inputHint = this.props.hint ?
            (
                <span id={`${this.props.inputId}-hint`} className="govuk-hint">
                    {this.props.hint}
                </span>
            ) :
            null;

        const inputField = this.inputType === 'email' ?
            (
                <input
                    className="govuk-input govuk-input--width-10"
                    id={this.elementUniqueId}
                    name={this.props.inputId}
                    type={this.inputType}
                    spellCheck='false'
                    autoComplete='email'
                    onChange={this.handleChange}
                    noValidate
                />
            ) :
            (
                <input
                    className="govuk-input govuk-input--width-10"
                    id={this.elementUniqueId}
                    name={this.props.inputId}
                    type={this.inputType}
                    onChange={this.handleChange}
                    noValidate
                />
            )

        return (

            <div className={`govuk-form-group ${this.props.showErrors && this.errors.visible.text.length > 0 ? "govuk-form-group--error" : ""}`}>
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