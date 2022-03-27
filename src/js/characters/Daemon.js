import Character from '../Character';
import characterMap from '../characterMap';

export default class Daemon extends Character {
  constructor() {
    const type = new.target.name.toLowerCase();
    const character = characterMap[type];
    super({ ...character, type });
  }
}
