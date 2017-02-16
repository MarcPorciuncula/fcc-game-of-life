import React from 'react';
import { connect } from 'react-redux';
import R from 'ramda';

import withDimensions from './withDimensions';
import {
  RESIZE,
  SET,
  TICK,
} from './reducers/universe';
import './Game.css';
import '@material/button/dist/mdc.button.css';

const CELL_WIDTH = 20;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.toggleCell = this.toggleCell.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.interval = null;
    this.state = {
      playing: false,
    }
  }
  componentDidMount() {
    this.handleResize();
  }
  componentWillReceiveProps(props) {
    if (this.props.width !== props.width || this.props.height !== props.height) {
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
  start() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.props.dispatch({ type: TICK });
    }, 1000 / 10);
    this.setState({
      playing: true,
    });
  }
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.setState({
      playing: false,
    });
  }
  render() {
    return (
      <div
        className="universe"
        style={{ height: this.props.universe.length * CELL_WIDTH, width: this.props.universe[0].length * CELL_WIDTH }}
      >
        {this.props.universe.map((row, y) => (
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
          ))
        ))}
        <button
          className="mdc-button mdc-button--raised start-stop-button"
          onClick={this.state.playing ? this.stop : this.start}
        >
          {this.state.playing ? 'Stop' : 'Start'}
        </button>
      </div>
    )
  }
}

export default R.compose(
  connect(
    (state) => ({
      universe: state.universe,
    }),
    (dispatch) => ({
      dispatch,
    }),
  ),
  withDimensions
)(Game);
