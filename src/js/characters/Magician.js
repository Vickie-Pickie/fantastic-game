import Character from '../Character';
import { TYPE_MAGICIAN } from './types';

export default class Magician extends Character {
  constructor(level, health) {
    super(level, TYPE_MAGICIAN, 10, 40, health);
  }
}
