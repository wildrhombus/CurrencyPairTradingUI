// src/reducers/price-reducer.js

const defaultState = {
  price: {},
  loading: false,
  errors: {}
}

export default (state=defaultState, action={}) => {
  switch (action.type) {
    case 'FETCH_PRICE_FULFILLED': {
      return {
        ...state,
        price: action.payload.data.last_price,
        errors: {},
        loading: false
      }
    }
    case 'FETCH_PRICE_PENDING': {
      return {
        ...state,
        loading: true
      }
    }
     case 'FETCH_PRICE_REJECTED': {
      return {
        ...state,
        errors: { global: action.payload.message },
        loading: false
      }
    }
    default:
      return state;
  }
}