// src/actions/price-actions.js

import { client } from './';

const url = '/ticker';

// Fetch the price from the node server

export const fetchPrice = () => (dispatch) => {
  dispatch({
    type: 'FETCH_PRICE',
    payload: client.get(url)
  })
}