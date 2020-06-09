import React from 'react';

import { onChange, onError } from '../../helpers/pageUpdatesHandler';

class Postcode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            postcode: null,
            errors: {
                postcode: {
                    current: {
                        text: 'Enter your postcode',
                        showSummaryText: false
                    },
                    visible: {
                        text: '',
                        showSummaryText: false
                    },
                    id: 'postcodeCustom'
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.onError = onError.bind(this);
        this.onChange = onChange.bind(this);
        this.isValidPostcode = this.isValidPostcode.bind(this);

        //initialise errors in parent component, which will contain a reference to them
        this.onError(this.props.errors);
    }

    handleChange(e) {
        e.preventDefault();

        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
            this.onChange({
                postcode: this.isValidPostcode() ? this.state.postcode : null
            });
        });
    }

    isValidPostcode() {
        let isValid = true;
        let postcode = this.state.postcode;
        let errors = this.state.errors;

        //clear errors
        errors.postcode.current.text = '';

        if (!postcode) {
            isValid = false;
            errors.postcode.current.text = 'Enter your postcode';
        }
        else if (!postcode.match(/([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$/)) {
            isValid = false;
            errors.postcode.current.text = 'Enter a valid postcode';
        }

        this.setState({ errors });

        return isValid;
    }

    render() {

        const { errors } = this.state;

        const postcodeErrorElement = this.props.showErrors && errors.postcode.visible.text.length > 0 ?
            (
                <span id="postcodeError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {errors.postcode.visible.text}
                </span>
            ) :
            null;

        return (
            <div className={`govuk-form-group ${this.props.showErrors && errors.postcode.visible.text.length > 0 ? "govuk-form-group--error" : ""}`}>
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