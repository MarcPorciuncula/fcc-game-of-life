import range from 'lodash/range';
import R from 'ramda';

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
      let newState = R.clone(state);
      newState[action.y][action.x] = cellReducer(newState[action.y][action.x], { type: CELL_SET, alive: action.alive });
      return newState;
    case TICK:
      return state.map((row, y) =>
        row.map((cell, x) => {
          return cellReducer(cell, {
            type: CELL_TICK,
            neighbours: tallyLiveNeighbours(state, { x, y })
          });
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

export function maybeAccessAt(array, { x, y }) {
  if (y < 0 || x < 0 || y >= array.length || x >= array[y].length) {
    return null;
  } else {
    return array[y][x];
  }
}

const RANGE = range(-1, 2);

export function tallyLiveNeighbours(array, { x, y }) {
  return RANGE
    .map((yRel) =>
      RANGE.map((xRel) => (
        (yRel === 0 && xRel === 0) ? null : maybeAccessAt(array, { x: x + xRel, y: y + yRel})
      ))
    )
    .reduce((a, b) => a.concat(b), [])
    .reduce((a, b) => !!b ? a + 1 : a, 0);
}
