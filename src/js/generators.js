import PositionedCharacter from './PositionedCharacter';
import { randomInteger } from './utils';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* generateTeam(allowedTypes, maxLevel, characterCount) {
  for (let i = 0; i < characterCount; i += 1) {
    const typeIndex = randomInteger(0, allowedTypes.length - 1);
    const level = randomInteger(1, maxLevel);
    yield new allowedTypes[typeIndex](level, 100);
  }
}

export function generatePosition(minCol, maxCol) {
  const row = randomInteger(0, 7);
  const column = randomInteger(minCol, maxCol);
  return 8 * row + column;
}

export function generatePositionedCharacters(characters, minCol, maxCol) {
  const blockedCells = [];
  return characters.map((character) => {
    let position = generatePosition(minCol, maxCol);
    while (blockedCells.includes(position)) {
      position = generatePosition(minCol, maxCol);
    }
    blockedCells.push(position);
    return new PositionedCharacter(character, position);
  });
}
