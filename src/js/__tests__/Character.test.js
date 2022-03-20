import Character from '../Character';
import { TYPE_BOWMAN } from '../characters/types';

test('Нельзя создать персонажа непрямую с помощью new Character', () => {
  expect(() => {
    /* eslint-disable */
    const char = new Character(1, TYPE_BOWMAN, 10, 40, 100);
  }).toThrowError();
});
