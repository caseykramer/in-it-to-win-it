import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise-middleware'
import rootReducer from './reducers'
import {loadNames} from './actions'
import './index.css';
import Home from './Home';
import reportWebVitals from './reportWebVitals';
import 'fontsource-roboto';


const loggerMiddleware = createLogger()
const store = createStore(rootReducer,{},applyMiddleware(thunkMiddleware,promise,loggerMiddleware))
store.dispatch(loadNames());

render(
  <Provider store={store}>
    <React.StrictMode>
      <Home />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
