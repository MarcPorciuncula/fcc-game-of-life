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

function Cell({ alive }) {
  return (
    <td className={classnames('cell', `cell--${alive ? 'alive' : 'dead'}`)} />
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
        return { alive: Math.random() < 0.1 }
      });
    });
    this.props.replace(universe);
  }
  start() {
    this.interval = setInterval(() => {
      const start = performance.now();
      this.props.tick();
      console.log(performance.now() - start);
    }, 1000 / 5);
  }
  render() {
    return (
      <div className="App">
        <table className="table">
          <tbody>
            {this.props.universe.map((row, i) => (
              <tr className="row" key={i}>
                {row.map(({ alive }, j) => (
                  <Cell key={j} alive={alive} />
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
