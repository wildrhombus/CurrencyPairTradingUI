// src/store.js

import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from "./reducers";

const middleware = composeWithDevTools(applyMiddleware(promise(), thunk));

export default function configureStore() {
  const store = createStore(rootReducer, middleware);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}