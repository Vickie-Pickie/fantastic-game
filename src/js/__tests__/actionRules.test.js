import {
  TYPE_BOWMAN,
  TYPE_SWORDSMAN,
  TYPE_MAGICIAN,
  TYPE_UNDEAD,
  TYPE_VAMPIRE,
  TYPE_DAEMON,
} from '../characters/types';
import {
  getPossibleAttackCells,
  getPossibleMoveCells,
} from '../actionRules';

test.each([
  [TYPE_BOWMAN, 35, [33, 34, 36, 37, 27, 26, 28, 43, 42, 44, 19, 17, 21, 51, 49, 53]],
  [TYPE_SWORDSMAN, 32, [33, 34, 35, 36, 24, 25, 40, 41, 16, 18, 48, 50, 8, 11, 56, 59, 0, 4]],
  [TYPE_MAGICIAN, 0, [1, 8, 9]],
  [TYPE_UNDEAD, 63, [59, 60, 61, 62, 55, 54, 47, 45, 39, 36, 31, 27]],
  [TYPE_VAMPIRE, 4, [2, 3, 5, 6, 12, 11, 13, 20, 18, 22]],
  [TYPE_DAEMON, 49, [48, 50, 41, 40, 42, 57, 56, 58]],
])(
  'Персонаж %s с исходной позиции %i может ходить на клетки %o',
  (character, startIndex, expected) => {
    const received = getPossibleMoveCells(character, startIndex);
    expect(received.sort()).toEqual(expected.sort());
  },
);

test.each([
  [
    TYPE_BOWMAN,
    35,
    /* eslint-disable */
    [33, 34, 36, 37, 25, 26, 27, 28, 29, 41, 42, 43, 44, 45, 17, 18, 19, 20, 21, 49, 50, 51, 52, 53],
  ],
  [
    TYPE_SWORDSMAN,
    32,
    [33, 40, 41, 24, 25],
  ],
  [
    TYPE_MAGICIAN,
    0,
    /* eslint-disable */
    [1, 2, 3, 4, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28, 32, 33, 34, 35, 36],
  ],
  [
    TYPE_UNDEAD,
    63,
    [55, 54, 62],
  ],
  [
    TYPE_VAMPIRE,
    4,
    [2, 3, 5, 6, 10, 11, 12, 13, 14, 18, 19, 20, 21, 22]
  ],
  [
    TYPE_DAEMON,
    49,
    /* eslint-disable */
    [16, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28, 29, 32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 45, 48, 50, 51, 52, 53, 56, 57, 58, 59, 60, 61],
  ],
])(
  'Персонаж %s с исходной позиции %i может атаковать противника на клетках %o',
  (character, startIndex, expected) => {
    const received = getPossibleAttackCells(character, startIndex);
    expect(received.sort()).toEqual(expected.sort());
  }
);
