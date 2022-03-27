import Character from '../Character';

test('Нельзя создать персонажа непрямую с помощью new Character', () => {
  expect(() => {
    /* eslint-disable */
    const char = new Character({
      level: 1,
      type: 'bowman',
      attack: 10,
      defence: 40,
      health: 100,
      team: 'player',
    });
  }).toThrowError();
});
