import { calcTileType } from '../utils';

test.each([
  [0, 8, 'top-left'],
  [2, 8, 'top'],
  [6, 8, 'top'],
  [7, 8, 'top-right'],
  [8, 8, 'left'],
  [40, 8, 'left'],
  [31, 8, 'right'],
  [47, 8, 'right'],
  [19, 8, 'center'],
  [37, 8, 'center'],
  [52, 8, 'center'],
  [56, 8, 'bottom-left'],
  [63, 8, 'bottom-right'],
  [57, 8, 'bottom'],
  [62, 8, 'bottom'],
])(
  'Для клетки %i на поле размером %i тип равен %s',
  (cell, boardSize, expected) => {
    const received = calcTileType(cell, boardSize);
    expect(received).toBe(expected);
  },
);
