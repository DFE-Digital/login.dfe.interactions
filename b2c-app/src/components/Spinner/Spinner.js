import React from 'react';
import components from '..';

import './Spinner.scss';

class Spinner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showB2CSpinner: false
        }
        this.b2cSpinnerCallback = this.b2cSpinnerCallback.bind(this);
    }

    //callback that will check if B2C has added or removed the modal overlay
    //which means we need to show or hide our own spinner
    b2cSpinnerCallback(mutationsList) {

        for (let mutation of mutationsList) {
            //show spinner if B2C has added simplemodal-overlay element
            mutation.addedNodes.forEach((node) => {
                if (node.id === 'simplemodal-overlay') {
                    this.setState({ showB2CSpinner: true });
                }
            });
            //hide spinner if B2C has removed simplemodal-overlay element
            mutation.removedNodes.forEach((node) => {
                if (node.id === 'simplemodal-overlay') {
                    this.setState({ showB2CSpinner: false });
                }
            });
        }
    }

    componentDidMount() {

        //we will be setting up an observer to show our spinner when B2C tries to show its own one
        const targetNode = document.getElementsByTagName("body")[0];

        if (targetNode) {
            const obs = new MutationObserver(this.b2cSpinnerCallback);
            const observerConfig = { childList: true };
            obs.observe(targetNode, observerConfig);
        }
    }

    render() {

        const message = this.props.text || 'Please wait while we process your information.';

        if (this.props.showSpinner || this.state.showB2CSpinner) {
            return (
                <div className="spinner-container" role="alert" aria-live="assertive">
                    <div className="spinner"></div>
                    <components.Paragraph>{message}</components.Paragraph>
                </div>
            )
        }
        else {
            return null
        }

    }
}

export default Spinner;