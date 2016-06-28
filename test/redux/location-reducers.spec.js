import test from 'ava';
import * as location from '../../src/location';
import chalk from 'chalk';
import * as JsDiff from 'diff';

// warning!
// t.deepEqual() tests attribute order while prettyDiff() does not
function deepEqual(t, actual, expected) {
  t.deepEqual(actual, expected, prettyDiff(actual, expected));
}

function prettyDiff(actual, expected) {
  const diff = JsDiff.diffJson(expected, actual).map(part => {
    if (part.added) return chalk.green(part.value.replace(/.+/g, '    - $&'));
    if (part.removed) return chalk.red(part.value.replace(/.+/g, '    + $&'));
    return chalk.gray(part.value.replace(/.+/g, '    | $&'));
  }).join('');
  return `\n${diff}\n`;
}

test('requests location', t => {
  const prevState = {
    position: [0.00, 0.00],
    loading: false,
    requested: false
  };
  const nextState = location.reducer(prevState,location.actions.requestLocation());
  deepEqual(t,nextState, {
    position: [0.00, 0.00],
    loading: true,
    requested: true
  });
});

test('receives location', t => {
  const prevState = {
    position: [0.00, 0.00],
    loading: true,
    requested: true
  };
  const positionObj = {
    coords: {
      latitude: 60.10,
      longitude: 40.10
    }
  };
  const nextState = location.reducer(prevState,location.actions.receiveLocation(positionObj));
  deepEqual(t,nextState, {
    position: [60.10, 40.10],
    loading: true,
    requested: true
  });
});

test('receives address', t => {
  const prevState = {
    loading: true,
    address: ''
  };
  const address = "Tölögatan 35, 00260 Helsingfors, Finland";
  const nextState = location.reducer(prevState,location.actions.receiveAddress(address));
  deepEqual(t, nextState, {
    loading: false,
    address: address
  });
});
