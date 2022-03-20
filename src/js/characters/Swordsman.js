import Character from '../Character';
import { TYPE_SWORDSMAN } from './types';

export default class Swordsman extends Character {
  constructor(level, health) {
    super(level, TYPE_SWORDSMAN, 40, 10, health);
  }
}
