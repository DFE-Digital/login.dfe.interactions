import React from 'react';

class DateOfBirth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dobDay: null,
            dobMonth: null,
            dobYear: null,
            errors: {
                dob: {
                    text: 'Enter date of birth',
                    showSummaryText: false,
                    id: 'dobFieldset'
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.isValidDob = this.isValidDob.bind(this);

        //initialise visible errors in parent component
        if (this.props.initialiseParentErrors) {
            this.props.initialiseParentErrors(this.state.errors);
        }
    }

    handleChange(e) {
        e.preventDefault();

        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
            let isValid = this.isValidDob();
            this.props.onChange({
                dob: isValid && this.inputDate ? this.inputDate : null
            });
        });
    }

    calculateAge(dob) {
        let currentDate = new Date();
        let years = (currentDate.getFullYear() - dob.getFullYear());

        if (currentDate.getMonth() < dob.getMonth() ||
            (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
            years--;
        }
        return years;
    }

    isValidDob() {
        let isValid = true;
        let day = this.state.dobDay;
        let month = this.state.dobMonth;
        let year = this.state.dobYear;

        //build new error state with empty value for text
        const newErrorState = { ...this.state.errors }
        newErrorState.dob.text = '';

        //now update values if invalid
        if (!day && !month && !year) {
            isValid = false;
            newErrorState.dob.text = 'Enter date of birth';
        }
        else if (!day || !month || !year || year.length !== 4) {
            isValid = false;
            newErrorState.dob.text = 'Enter a valid date of birth';
        }
        else {
            //get value for month ready to be used by Date functions
            month = month - 1;

            //validate the date input
            this.inputDate = new Date(year, month, day);

            let age = this.calculateAge(this.inputDate);

            if (isNaN(this.inputDate.getTime()) ||
                this.inputDate.getMonth() !== month || //this one would mean user entered 29th of a month in a non leap year
                age < 13 || age > 65) {
                //failed validation, show an error and prevent submit
                isValid = false;
                newErrorState.dob.text = 'Enter a valid date of birth';
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

        let dobErrorElement;
        if (showErrors && visibleErrors.dob.text.length > 0) {
            dobErrorElement =
                <span id="dobError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {visibleErrors.dob.text}
                </span>
        }

        return (
            <div className={`govuk-form-group ${this.props.showErrors && visibleErrors.dob.text.length > 0 ? "govuk-form-group--error" : ""}`}>
                <fieldset className="govuk-fieldset" role="group" aria-describedby="date-of-birth-hint" id="dobFieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <label className="govuk-label">
                            Date of birth
                        </label>
                    </legend>
                    {dobErrorElement}
                    <span id="date-of-birth-hint" className="govuk-hint">
                        For example, 31 3 1980
                    </span>
                    <div className="govuk-date-input" id="date-of-birth">
                        <div className="govuk-date-input__item">
                            <div className="govuk-form-group">
                                <label className="govuk-label govuk-date-input__label" htmlFor="dobDay">
                                    Day
                                </label>
                                <input className="govuk-input govuk-date-input__input govuk-input--width-2" id="dobDay" name="dobDay" type="number" pattern="[0-9]*" inputMode="numeric" onChange={this.handleChange} noValidate />
                            </div>
                        </div>
                        <div className="govuk-date-input__item">
                            <div className="govuk-form-group">
                                <label className="govuk-label govuk-date-input__label" htmlFor="dobMonth">
                                    Month
                                </label>
                                <input className="govuk-input govuk-date-input__input govuk-input--width-2" id="dobMonth" name="dobMonth" type="number" pattern="[0-9]*" inputMode="numeric" onChange={this.handleChange} noValidate />
                            </div>
                        </div>
                        <div className="govuk-date-input__item">
                            <div className="govuk-form-group">
                                <label className="govuk-label govuk-date-input__label" htmlFor="dobYear">
                                    Year
                                </label>
                                <input className="govuk-input govuk-date-input__input govuk-input--width-4" id="dobYear" name="dobYear" type="number" pattern="[0-9]*" inputMode="numeric" onChange={this.handleChange} noValidate />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        )
    }
}

export default DateOfBirth;