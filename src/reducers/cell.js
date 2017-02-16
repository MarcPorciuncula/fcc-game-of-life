
export const SET = 'cell/SET';
export const TICK = 'cell/TICK';

const DEFAULT_STATE = 0;

export default function cell(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case SET:
      return action.alive ? 1 : 0;
    case TICK:
      if (!!state && (action.neighbours <= 1 || action.neighbours > 3)) {
        return 0;
      } else if (!state && action.neighbours === 3) {
        return 1;
      }
      return state ? state + 1 : 0;
    default:
      return state;
  }
}
