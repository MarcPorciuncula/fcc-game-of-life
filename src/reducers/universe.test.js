import test from 'ava';

import reducer, {
  SET,
  RESIZE,
  TICK,
  CLEAR,
  maybeAccessAt,
  tallyLiveNeighbours,
} from './universe';

function action(type, options = {}) {
  return Object.assign({ type }, options);
}

function isAlive(n) {
  return !!n;
}

test('it returns the default state (a 1 x 1 universe with a single dead cell)', (t) => {
  const state = reducer(undefined, action('@init'));
  t.true(Array.isArray(state));
  t.is(state.length, 1);
  t.true(Array.isArray(state[0]));
  t.is(state[0].length, 1);
  t.false(isAlive(state[0][0]));
});

test('SET changes the cell at the specified location to alive or dead', (t) => {
  let state = reducer(undefined, action('@init'));
  state = reducer(state, action(SET, { x: 0, y: 0, alive: true }));
  t.true(isAlive(state[0][0]));
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
  t.true(isAlive(state[0][1]));
});

test('TICK advances the game', (t) => {
  let state = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ];
  state = reducer(state, action(TICK));
  t.deepEqual(state, [
    [0, 1, 0],
    [0, 2, 0],
    [0, 1, 0],
  ]);
  // state = reducer(state, action(TICK));
  // t.deepEqual(state, [
  //   [2, 3, 0],
  //   [3, 3, 0],
  //   [0, 0, 0],
  // ]);
});

test('CLEAR makes all cells on the board dead', (t) => {
  let state = [
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 0],
  ];
  state = reducer(state, action(CLEAR));
  t.deepEqual(state, [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
});

test('maybeAccessAt returns an existing element', (t) => {
  const arr = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  t.is(maybeAccessAt(arr, { x: 1, y: 2 }), 7);
})

test('maybeAccessAt returns null when out of bounds', (t) => {
  const arr = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  t.is(maybeAccessAt(arr, { x: 1, y: 3 }), null);
  t.is(maybeAccessAt(arr, { x: 0, y: -1 }), null);
});

test('tallyLiveNeighbours counts the number of live neighbours', (t) => {
  let state;

  state = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];
  t.is(tallyLiveNeighbours(state, { x: 1, y: 1 }), 0);

  state = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  t.is(tallyLiveNeighbours(state, { x: 1, y: 1 }), 0);

  state = [
    [0, 0, 3],
    [1, 0, 0],
    [0, 1, 5],
  ];
  t.is(tallyLiveNeighbours(state, { x: 1, y: 1 }), 4);

  state = [
    [0, 0, 1],
    [1, 0, 0],
    [0, 1, 0],
  ];
  t.is(tallyLiveNeighbours(state, { x: 1, y: 1 }), 3);

  state = [
    [0, 0, 1],
    [1, 0, 0],
    [0, 1, 0],
  ];
  const neighbours = state.map((row, y) => row.map((cell, x) => tallyLiveNeighbours(state, { x, y })));
  t.deepEqual(neighbours, [
    [1, 2, 0],
    [1, 3, 2],
    [2, 1, 1],
  ]);
});

test('tallyLiveNeighbours works on the edges of the universe', (t) => {
  let state;

  state = [
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 0],
  ];
  t.is(tallyLiveNeighbours(state, { x: 0, y: 0 }), 3);

  state = [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 1],
  ];
  t.is(tallyLiveNeighbours(state, { x: 2, y: 1 }), 5);
});
