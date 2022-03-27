import {
  randomInteger,
  calculateLevelUpAbility,
} from './utils';

export default class Character {
  constructor({
    level,
    attack,
    defence,
    health,
    team,
    type,
  }) {
    if (Object.getPrototypeOf(new.target).name.length === 0) {
      throw new Error('Персонаж не может быть создан через Character');
    }

    this.level = level;
    this.attack = attack;
    this.defence = defence;
    this.health = health;
    this.team = team;
    this.type = type;

    for (let i = 1; i < this.level; i += 1) {
      const healthPercent = randomInteger(30, 70) / 100;
      this.levelUpAD(healthPercent);
    }
  }

  isPlayerType() {
    return this.team === 'player';
  }

  levelUp() {
    const healthPercent = this.health / 100;
    this.levelUpAD(healthPercent);
    this.health += 80;

    if (this.health > 100) {
      this.health = 100;
    }

    this.level += 1;
  }

  levelUpAD(healthPercent) {
    this.attack = calculateLevelUpAbility(this.attack, healthPercent);
    this.defence = calculateLevelUpAbility(this.defence, healthPercent);
  }
}
