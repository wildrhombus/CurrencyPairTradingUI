// src/reducers/index.js

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import PriceReducer from './price-reducer';

const reducers = {
  priceStore: PriceReducer,

  // Use plugin to clear the trade USD value when the form submits successfully.
  form: formReducer.plugin({
    trade: (state, action) => {
      switch(action.type) {
        case '@@redux-form/SET_SUBMIT_SUCCEEDED':
          return {...state, values: {}};
        default:
          return state;
      }
    }
  })
}

const rootReducer = combineReducers(reducers);

export default rootReducer;