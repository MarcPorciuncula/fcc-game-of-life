import test from 'ava';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

test.skip('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
