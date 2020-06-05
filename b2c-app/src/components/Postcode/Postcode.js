import React from 'react';

class Postcode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            postcode: null,
            errors: {
                postcode: {
                    currentMessage: 'Enter your postcode',
                    visibleMessage: '',
                    id: 'postcodeCustom'
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.isValidPostcode = this.isValidPostcode.bind(this);

        //initialise errors in parent component, which will contain a reference to them
        props.onError(this.state.errors);
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
        let errors = this.state.errors;

        //clear errors
        errors.postcode.currentMessage = '';

        if (!postcode) {
            isValid = false;
            errors.postcode.currentMessage = 'Enter your postcode';
        }
        else if (!postcode.match(/([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$/)) {
            isValid = false;
            errors.postcode.currentMessage = 'Enter a valid postcode';
        }

        this.setState({ errors });

        return isValid;
    }

    render() {

        const { errors } = this.state;

        const postcodeErrorElement = this.props.showErrors && errors.postcode.visibleMessage.length > 0 ?
            (
                <span id="postcodeError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {errors.postcode.visibleMessage}
                </span>
            ) :
            null;

        return (
            <div className={`govuk-form-group ${this.props.showErrors && errors.postcode.visibleMessage.length > 0 ? "govuk-form-group--error" : ""}`}>
                <label className="govuk-label" htmlFor="postcodeCustom">
                    Enter your postcode
                </label>
                {postcodeErrorElement}
                <span id="postcode-hint" className="govuk-hint">
                    For example, SW1A 1AA
                </span>
                <input className="govuk-input govuk-input--width-10" id="postcodeCustom" name="postcode" type="text" onChange={this.handleChange} noValidate />
            </div>
        )
    }
}

export default Postcode;