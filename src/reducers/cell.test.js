import test from 'ava';

import reducer, {
  SET,
  TICK,
} from './cell';

function action(type, options = {}) {
  return Object.assign({ type }, options);
}

test('it returns the default state (a dead cell)', (t) => {
  const state = reducer(undefined, action('@init'));
  t.false(state.alive);
});

test('SET changes the cell to alive or dead', (t) => {
  let state = reducer(undefined, action('@init'));
  state = reducer(state, action(SET, { alive: true }));
  t.true(state.alive);
  state = reducer(state, action(SET, { alive: false }));
  t.false(state.alive);
});

test('TICK - a live cell with fewer than two live neighbours dies', (t) => {
  let state = reducer(undefined, action('@init'));
  state = reducer(state, action(SET, { alive: true }));
  state = reducer(state, action(TICK, { neighbours: 1 }));
  t.false(state.alive);
  state = reducer(state, action(SET, { alive: true }));
  state = reducer(state, action(TICK, { neighbours: 0 }));
  t.false(state.alive);
});

test('TICK - a live cell with two or three live neighbours lives on', (t) => {
  let state = reducer(undefined, action('@init'));
  state = reducer(state, action(SET, { alive: true }));
  state = reducer(state, action(TICK, { neighbours: 2 }));
  t.true(state.alive);
  state = reducer(state, action(TICK, { neighbours: 3 }));
  t.true(state.alive);
})

test('TICK - a live cell with more than three live neighbours dies', (t) => {
  let state = reducer(undefined, action('@init'));
  for (let i = 4; i < 9; i++) {
    state = reducer(state, action(SET, { alive: true }));
    state = reducer(state, action(TICK, { neighbours: 4 }));
    t.false(state.alive);
  }
});

test('TICK - a dead call with exactly three live neighbours becomes a live cell', (t) => {
  let state = reducer(undefined, action('@init'));
  state = reducer(state, action(SET, { alive: false }));
  state = reducer(state, action(TICK, { neighbours: 3 }));
  t.true(state.alive);
});
