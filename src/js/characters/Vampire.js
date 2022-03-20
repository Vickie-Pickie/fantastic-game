import Character from '../Character';
import { TYPE_VAMPIRE } from './types';

export default class Vampire extends Character {
  constructor(level, health) {
    super(level, TYPE_VAMPIRE, 25, 25, health);
  }
}
