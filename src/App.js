import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import {
  RESIZE,
  SET,
  REPLACE,
  TICK,
} from './reducers/universe';
import './App.css';

function Cell({ lifetime }) {
  return (
    <td className="cell" style={{ backgroundColor: '#0091EA', opacity: lifetime > 0 ? Math.log10(lifetime + 1) : 0 }} />
  );
}

class App extends Component {
  componentWillMount() {
    this.props.resize({ width: 30, height: 30 });
    setTimeout(() => {
      this.randomize();
      this.start();
    }, 1);
  }
  randomize() {
    const universe = this.props.universe.map((row, y) => {
      return row.map((cell, x) => {
        return Math.random() < 0.6 ? 1 : 0
      });
    });
    this.props.replace(universe);
  }
  start() {
    this.interval = setInterval(() => {
      const start = performance.now();
      this.props.tick();
      console.log(performance.now() - start);
    }, 1000 / 30);
  }
  render() {
    return (
      <div className="App">
        <table className="table">
          <tbody>
            {this.props.universe.map((row, i) => (
              <tr className="row" key={i}>
                {row.map((lifetime, j) => (
                  <Cell key={j} lifetime={lifetime} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    universe: state.universe,
  }),
  (dispatch) => ({
    resize: (params) => dispatch(Object.assign({ type: RESIZE }, params)),
    set: (params) => dispatch(Object.assign({ type: SET }, params)),
    replace: (state) => dispatch({ type: REPLACE, state }),
    tick: (state) => dispatch({ type: TICK }),
  }),
)(App);
