
export const SET = 'cell/SET';
export const TICK = 'cell/TICK';

const DEFAULT_STATE = {
  alive: false,
};

export default function cell(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case SET:
      return Object.assign({}, state, {
        alive: action.alive,
      });
    case TICK:
      if (state.alive && (action.neighbours === 1 || action.neighbours > 3)) {
        return Object.assign({}, state, { alive: false });
      } else if (action.neighbours === 3) {
        return Object.assign({}, state, { alive: true });
      }
      return state;
    default:
      return state;
  }
}
