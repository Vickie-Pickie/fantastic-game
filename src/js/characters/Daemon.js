import Character from '../Character';
import { TYPE_DAEMON } from './types';

export default class Daemon extends Character {
  constructor(level, health) {
    super(level, TYPE_DAEMON, 10, 40, health);
  }
}
