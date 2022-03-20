import PositionedCharacter from './PositionedCharacter';
import Character from './Character';

export default class GameState {
  constructor() {
    this.level = 0;
    this.theme = '';
    this.player = [];
    this.enemy = [];
    this.turn = 'player';
    this.points = 0;
    this.isOver = false;
  }

  static from(object) {
    Object.setPrototypeOf(object, GameState.prototype);
    object.characters.forEach((posChar) => {
      Object.setPrototypeOf(posChar, PositionedCharacter.prototype);
      Object.setPrototypeOf(posChar.character, Character.prototype);
    });

    return object;
  }

  get characters() {
    return [...this.player, ...this.enemy];
  }
}
