import React from 'react';
import { connect } from 'react-redux';
import R from 'ramda';

import withDimensions from './withDimensions';
import { RESIZE, SET, TICK, CLEAR, REPLACE } from './reducers/universe';
import './Game.css';
import '@material/button/dist/mdc.button.css';

const CELL_WIDTH = 20;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.toggleCell = this.toggleCell.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    this.randomize = this.randomize.bind(this);
    this.interval = null;
    this.state = {
      playing: false,
      steps: 0,
    };
  }
  componentDidMount() {
    this.handleResize();
  }
  componentWillReceiveProps(props) {
    if (
      this.props.width !== props.width ||
      this.props.height !== props.height
    ) {
      setTimeout(this.handleResize, 1);
    }
  }
  handleResize() {
    let width = Math.floor(this.props.width / CELL_WIDTH) || 1;
    let height = Math.floor(this.props.height / CELL_WIDTH) || 1;
    this.props.dispatch({ type: RESIZE, width, height });
  }
  toggleCell(x, y) {
    this.props.dispatch({ type: SET, x, y, alive: !this.props.universe[y][x] });
  }
  play() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.props.dispatch({ type: TICK });
      this.setState({
        steps: this.state.steps + 1,
      });
    }, 1000 / 10);
    this.setState({
      playing: true,
    });
  }
  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.setState({
      playing: false,
    });
  }
  reset() {
    this.pause();
    this.setState({
      steps: 0,
    });
    this.props.dispatch({ type: CLEAR });
  }
  randomize() {
    this.reset();
    this.props.dispatch({
      type: REPLACE,
      state: this.props.universe.map(row =>
        row.map(() => (Math.random() < 0.4 ? 1 : 0)),
      ),
    });
  }
  render() {
    return (
      <div
        className="universe"
        style={{
          height: this.props.universe.length * CELL_WIDTH,
          width: this.props.universe[0].length * CELL_WIDTH,
        }}
      >
        {this.props.universe.map((row, y) =>
          row.map((cellAge, x) => (
            <div
              key={`${x}:${y}`}
              className="cell"
              style={{
                opacity: cellAge > 0 ? Math.log10(cellAge + 1) : 0,
                top: y * CELL_WIDTH,
                left: x * CELL_WIDTH,
              }}
              onClick={() => this.toggleCell(x, y)}
            />
          )),
        )}
        <div className="docked">
          <div className="menu">
            <button
              className="mdc-button mdc-button--raised"
              onClick={this.state.playing ? this.pause : this.play}
            >
              {this.state.playing ? 'Pause' : 'Play'}
            </button>
            <button className="mdc-button" onClick={this.reset}>
              Reset
            </button>
            <button className="mdc-button" onClick={this.randomize}>
              Random
            </button>
            <button disabled className="mdc-button">
              {this.state.steps}
            </button>
          </div>
          <p className="credit">
            Made by
            {' '}
            <a href="https://github.com/MarcoThePoro">Marc Porciuncula</a>
            .
            {' '}
            <a href="https://github.com/MarcoThePoro/fcc-game-of-life">
              View source on GitHub
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default R.compose(
  connect(
    state => ({
      universe: state.universe,
    }),
    dispatch => ({
      dispatch,
    }),
  ),
  withDimensions,
)(Game);
