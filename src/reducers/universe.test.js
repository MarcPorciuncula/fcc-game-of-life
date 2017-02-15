import test from 'ava';

import reducer, {
  SET,
  RESIZE,
  TICK,
  CLEAR,
} from './universe';

function action(type, options = {}) {
  return Object.assign({ type }, options);
}

test('it returns the default state (a 1 x 1 universe with a single dead cell)', (t) => {
  const state = reducer(undefined, action('@init'));
  t.true(Array.isArray(state));
  t.is(state.length, 1);
  t.true(Array.isArray(state[0]));
  t.is(state[0].length, 1);
  t.false(state[0][0].alive);
});

test('SET changes the cell at the specified location to alive or dead', (t) => {
  let state = reducer(undefined, action('@init'));
  state = reducer(state, action(SET, { x: 0, y: 0, alive: true }));
  t.true(state[0][0].alive);
});

test('RESIZE expands or shrinks the board to the specified dimensions', (t) => {
  let state = reducer(undefined, action('@init'));
  state = reducer(state, action(RESIZE, { width: 20, height: 10 }));
  t.plan(62);
  t.is(state.length, 10);
  state.forEach(row => {
    t.is(row.length, 20);
  });
  state = reducer(state, action(RESIZE, { width: 5, height: 50 }));
  t.is(state.length, 50);
  state.forEach(row => {
    t.is(row.length, 5);
  });
});

test('RESIZE preserves existing cell states when expanding', (t) => {
  let state = reducer(undefined, action('@init'));
  state = reducer(state, action(SET, { x: 1, y: 0, alive: true }));
  state = reducer(state, action(RESIZE, { width: 5, height: 5 }));
  t.true(state[0][1].alive);
});

test('TICK advances the game', (t) => {
  const LIVE = { alive: true };
  const DEAD = { alive: false };
  let state = [
    [DEAD, LIVE, DEAD],
    [LIVE, LIVE, DEAD],
    [DEAD, DEAD, DEAD],
  ];
  state = reducer(state, action(TICK));
  t.deepEqual(state, [
    [LIVE, LIVE, DEAD],
    [LIVE, LIVE, DEAD],
    [DEAD, DEAD, DEAD],
  ]);
});

test('CLEAR makes all cells on the board dead', (t) => {
  const LIVE = { alive: true };
  const DEAD = { alive: false };
  let state = [
    [DEAD, LIVE, DEAD],
    [LIVE, LIVE, DEAD],
    [DEAD, DEAD, DEAD],
  ];
  state = reducer(state, action(CLEAR));
  t.deepEqual(state, [
    [DEAD, DEAD, DEAD],
    [DEAD, DEAD, DEAD],
    [DEAD, DEAD, DEAD],
  ]);
});
