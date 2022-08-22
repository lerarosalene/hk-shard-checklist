import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from 'store';
import { App } from 'components/App';
import { loadData } from 'modules/list/slice';

const rootNode = document.querySelector('#root')!;
const root = ReactDOM.createRoot(rootNode);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

store.dispatch(loadData());
