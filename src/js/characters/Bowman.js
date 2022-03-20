import Character from '../Character';
import { TYPE_BOWMAN } from './types';

export default class Bowman extends Character {
  constructor(level, health) {
    super(level, TYPE_BOWMAN, 25, 25, health);
  }
}
