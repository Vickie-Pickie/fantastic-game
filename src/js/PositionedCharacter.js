import Character from './Character';
import {
  getPossibleAttackCells,
  getPossibleMoveCells,
} from './actionRules';

export default class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
    this.possibleMoves = getPossibleMoveCells(this.character.type, this.position);
    this.possibleAttacks = getPossibleAttackCells(this.character.type, this.position);
  }

  setPosition(position) {
    this.position = position;
    this.possibleMoves = getPossibleMoveCells(this.character.type, this.position);
    this.possibleAttacks = getPossibleAttackCells(this.character.type, this.position);
  }

  canMove(index) {
    return this.possibleMoves.includes(index);
  }

  canAttack(index) {
    return this.possibleAttacks.includes(index);
  }
}
