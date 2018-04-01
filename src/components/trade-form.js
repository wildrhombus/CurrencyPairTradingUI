// src/components/trade-form.js

import React, { Component } from 'react';
import { Field, reduxForm } from "redux-form";
import classnames from 'classnames';

// Form component for getting and submitting the USD trade and showing the BTC quote

class TradeForm extends Component {

  // Validation for the usd input
  // Checks to see if the value is a number
  // Also checks to see if the value exceeds the current USD balance
  validateUSD = (value, allValues, props) => {
    const balance = this.props.balance;
    if (typeof value != "undefined" && isNaN(Number(value)) ) {
      return('Must be a number');
    } else if ( value > balance ) {
      return(`Max amount ${balance.toFixed(2)} exceeded`);
    } else if ( value <= 0 ) {
      return('Must be positive');
    }
  }

  // Setup input field with all of the error formatting available to Field.
  renderField = ({ input, label, title, placeholder, meta: { touched, error } }) => (
    <div className="{classnames({error:touched && error})} trade--section" >
      <h1>{title}</h1>
      <div className="trade--section-form-label">{label}</div>
      <input {...input} placeholder={placeholder} type='text'/>
      {touched && error && <span className="error">{error}</span>}
    </div>
  )

  render() {
    const { handleSubmit, onChange, pristine, submitting, loading, servererror, invalid, btc } = this.props;

    // Render the form.  Make sure that submit is disabled if the input is invalid
    // Or the quote is in the middle of fetching a new value.
    return (
      <div className="trade--section-form">
        <form onSubmit={handleSubmit} name='trade'>
          <Field name="usd" component={this.renderField}
            label="USD" title="Trade" placeholder="Enter your amount"
            validate={this.validateUSD} onChange={onChange} />

          <div className="trade--section">
            <h1>For</h1>
            <div className="trade--section-form-label">BTC</div>
            <input readOnly placeholder="Display Quote" type="text" value={this.props.btc}/>
          </div>
          {servererror && <div className="error">{servererror}</div>}

          <button primary="true" type="submit" disabled={loading || invalid || pristine || submitting}>Trade</button>
        </form>
      </div>
    )
  }
}
export default reduxForm({form: 'trade'})(TradeForm);