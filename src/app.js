// app.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {reset} from 'redux-form';
import NumberFormat from 'react-number-format';
import debounce from 'debounce';

import { fetchPrice } from './actions/price-actions';
import TradeForm from './components/trade-form';

// The Page component to control the trade form
class App extends React.Component {
  constructor(props) {
    super(props);

    // Setup an initial state for the Balance, and an empty trade
    // Todo:  put the initial balance in a config file
    this.state = {
      balance: {
        usd: 156.12,
        btc: 0.000000000,
      },
      trade: {
        usd: 0,
        btc: ''
      }
    };
  }

  componentDidMount() {
    this.props.fetchPrice();
    this.setState({
      balance: {
        usd: 156.12,
        btc: 0.000000000,
      },
      trade: {
        usd: 0,
        btc: ''
      }
    });
  }


  // If the price changes, update the btc quote in the trade state.
  componentWillReceiveProps(nextProps) {
    if (this.props.price !== nextProps.price && this.state.trade.usd !== 0) {
      this.setState(this.newTradeState(this.state.trade.usd, parseFloat(this.props.price)));
    }
  }


  // Create a new trade state using current btc price.
  newTradeState(newUsd, btcPrice) {
    const newBtc = (newUsd / btcPrice).toFixed(9);
    return {...this.state, trade: {usd: newUsd, btc: newBtc}};
  }

  // create a new balance from an existing trade
  newBalanceState() {
    const balance = this.state.balance;
    const trade = this.state.trade;

    return {...this.state,
        balance: { usd: (balance.usd - trade.usd), btc: (balance.btc + parseFloat(trade.btc))},
        trade: { usd: 0, btc: ''}
      };
  }

  // When the form is submitted, update the state balance with the new trade.
  submit = (values) => {
    this.setState(this.newBalanceState());
  }

  // When the usd trade value changes, get a new price quote from bitfinex.
  // This is debounced to make sure that the user typing doesn't cause a
  // rate error on the api.
  updateBTC = debounce((value) => {
    let usdf = parseFloat(value.usd);
    if (usdf.toString() === value.usd) {
      this.setState(this.newTradeState(usdf, parseFloat(this.props.price)));
      this.props.fetchPrice();
    }
  },500);

  render() {
    return (
      <div className="trade">
        <div className="trade--section">
          <h1>Account Balance</h1>
          <div className="trade--section-balance">
            <div className="tst__balance_usd">
              <label>USD</label>
              <NumberFormat value={this.state.balance.usd.toFixed(2)} displayType={'text'}/>
              </div>
            <div className="tst__balance_btc">
              <label>BTC</label>
              <NumberFormat value={this.state.balance.btc.toFixed(9)} displayType={'text'}/>
            </div>
          </div>
        </div>
        <TradeForm
        btc={this.state.trade.btc}
        balance={this.state.balance.usd}
        loading={this.props.loading}
        onSubmit={this.submit} onChange={this.updateBTC}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    price: state.priceStore.price,
    loading: state.priceStore.loading
  }
}
export default connect(mapStateToProps, {fetchPrice})(App);