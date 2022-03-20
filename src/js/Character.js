import {
  TYPE_BOWMAN,
  TYPE_SWORDSMAN,
  TYPE_MAGICIAN,
} from './characters/types';
import { randomInteger } from './utils';

const playerTypes = [TYPE_BOWMAN, TYPE_SWORDSMAN, TYPE_MAGICIAN];

function calculateLevelUpAbility(value, healthPercent) {
  return Math.max(value, Math.round(value * (1 + 0.7 * healthPercent)));
}

export default class Character {
  constructor(level, type, attack, defence, health) {
    if (this.constructor.name === 'Character') {
      throw new Error('Персонаж не может быть создан через Character');
    }

    this.level = level;
    this.attack = attack;
    this.defence = defence;
    this.health = health;
    this.type = type;

    for (let i = 1; i < this.level; i += 1) {
      const healthPercent = randomInteger(30, 70) / 100;
      this.attack = calculateLevelUpAbility(this.attack, healthPercent);
      this.defence = calculateLevelUpAbility(this.defence, healthPercent);
    }
  }

  isPlayerType() {
    return playerTypes.includes(this.type);
  }

  levelUp() {
    const healthPercent = this.health / 100;
    this.attack = calculateLevelUpAbility(this.attack, healthPercent);
    this.defence = calculateLevelUpAbility(this.defence, healthPercent);
    this.health += 80;

    if (this.health > 100) {
      this.health = 100;
    }

    this.level += 1;
  }
}
