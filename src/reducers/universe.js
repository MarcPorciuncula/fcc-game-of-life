import range from 'lodash/range';

import cellReducer, {
  SET as CELL_SET,
  TICK as CELL_TICK,
} from './cell';

export const SET = 'universe/SET';
export const RESIZE = 'universe/RESIZE';
export const TICK = 'universe/TICK';
export const CLEAR = 'universe/CLEAR';
export const REPLACE = 'universe/REPLACE';

const DEFAULT_STATE = [[cellReducer(undefined, {})]];

export default function universe(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case RESIZE:
      return range(0, action.height).map((y) =>
        range(0, action.width).map((x) =>
          (y < state.length && x < state[y].length) ? state[y][x] : cellReducer(undefined, {}),
        )
      );
    case SET:
      return [
        ...state.slice(0, action.y),
        [
          ...state[action.y].slice(0, action.x),
          cellReducer(state[action.y][action.x], { type: CELL_SET, alive: action.alive }),
          ...state[action.y].slice(action.x),
        ],
        ...state.slice(action.y + 1),
      ];
    case TICK:
      return state.map((row, y) =>
        row.map((cell, x) => {
          let neighbouringCells = range(-1, 3).map((yRel) =>
            range(-1, 3).map((xRel) =>
              (yRel === 0 && xRel === 0) ? null : maybeAccessAt(state, { x: x + xRel, y: y + yRel})
            )
          ).reduce((arr, row) => arr.concat(row), []);
          let nLiveNeighbouringCells = neighbouringCells
            .map((neighbouringCell) => neighbouringCell && neighbouringCell.alive)
            .reduce((n, alive) => alive ? n + 1 : n, 0);
          return cellReducer(cell, { type: CELL_TICK, neighbours: nLiveNeighbouringCells });
        })
      );
    case CLEAR:
      return state.map((row) =>
        row.map(() =>
          cellReducer(undefined, {}),
        )
      );
    case REPLACE:
      return action.state;
    default:
      return DEFAULT_STATE;
  }
}

function maybeAccessAt(array, { x, y }) {
  if (y < 0 || x < 0 || y >= array.length || x >= array[y].length) {
    return null;
  } else {
    return array[y][x];
  }
}
