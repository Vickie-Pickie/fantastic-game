import Character from '../Character';
import { TYPE_UNDEAD } from './types';

export default class Undead extends Character {
  constructor(level, health) {
    super(level, TYPE_UNDEAD, 40, 10, health);
  }
}
