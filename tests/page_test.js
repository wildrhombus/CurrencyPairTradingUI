import App from '../src/app';
import React from 'react';
import { reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import { expect } from 'chai';
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';


// Configure the mock store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Configure the Enzyme adapater for react-16
Enzyme.configure({ adapter: new Adapter() });

describe("Currency Price App tests", () => {
  let store;
  let tradePage;
  let tradeForm;
  let form;

// Mock the api calls 
  beforeEach(() => {
    nock('http://localhost:3001')
    .defaultReplyHeaders({
      'Content-Type': 'application/json'
    })
    .get('/ticker')
    .reply(200, { price: 8000 } )

// Mock the redux store.
    const store = mockStore({ priceStore: {price: 8000, loading: false, errors: {}},
      form: {
        trade: {
          anyTouched: true,
          registeredFields: { usd: { name: "usd", type: "Field", count: 1}},
          fields: { usd: { touched: true, visited: true}},
          values: { usd: "23.41" }
        }
      }
    });

    // Get the page 
    tradePage = Enzyme.shallow(
      <Provider store={store}>
        <App />
      </Provider>
    ).dive({ context: {store: store}}).dive();

    // Set the page initial state
    tradePage.setState({
      balance: {
        usd: 156.12,
        btc: 0.000000000,
      },
      trade: {
        usd: 12.23,
        btc: .00152875
      }
    });

    // Helpers for accessing the Trade Form, and the actual form element
    tradeForm = tradePage.find('ReduxForm').dive().dive().dive().dive();
    form = tradeForm.find('form');
  });


// Form Submission Tests
  it('should initialize balance', () => {
    const balance = tradePage.find('NumberFormat');

    expect(balance.at(0).props().value).to.equal('156.12');
    expect(balance.at(1).props().value).to.equal('0.000000000');
  });


  it('should update balance when form is submitted', () => {
    form.simulate('submit');
    tradePage.update();

    const balance = tradePage.find('NumberFormat');

    expect(balance.at(0).props().value).to.equal('143.89');
    expect(balance.at(1).props().value).to.equal('0.001528750');
  });

  it('should update the balance after second submit', () => {
    form.simulate('submit');
    tradePage.update();

    // Change the internal trade state to add a new trade
    tradePage.setState({...tradePage.state(),
      trade: {
        usd: 100.50,
        btc: .00125625
      }
    });

    // Simulate the second submit
    form.simulate('submit');
    tradePage.update();

    const balance = tradePage.find('NumberFormat');

    expect(balance.at(0).props().value).to.equal('43.39');
    expect(balance.at(1).props().value).to.equal('0.002785000');
  });


  it('should update quote when usd value changes', () => {
    // The USD input has a debounce on it so the timers need to be faked
    const clock = sinon.useFakeTimers();

    // Change the input to a new value
    const input = tradeForm.find('Field').first();
    input.simulate('change', {usd: '30'});

    // Simulate the debounce
    clock.tick(510);

    // Fake out the new fetchPrice from the api
    nock('http://localhost:3001')
    .defaultReplyHeaders({
      'Content-Type': 'application/json'
    })
    .get('/ticker')
    .reply(200, { price: 8000 } )

    const tradeState = tradePage.instance().state.trade;
    expect(tradeState.usd).to.equal(30);
    expect(tradeState.btc).to.equal('0.003750000');

    clock.restore();
  });
});