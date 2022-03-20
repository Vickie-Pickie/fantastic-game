import levels from './levels';
import cursors from './cursors';
import {
  generatePositionedCharacters,
  generateTeam,
} from './generators';
import { randomInteger } from './utils';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import GameState from './GameState';
import {
  calculateDamage,
  getPossibleAttackCells,
} from './actionRules';
import Magician from './characters/Magician';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.state = new GameState();
    this.selectedChar = null;

    this.onNewGame = this.onNewGame.bind(this);
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onSaveGame = this.onSaveGame.bind(this);
    this.onLoadGame = this.onLoadGame.bind(this);
  }

  init() {
    const { theme } = levels[0];
    this.gamePlay.drawUi(theme);
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addNewGameListener(this.onNewGame);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    this.gamePlay.addSaveGameListener(this.onSaveGame);
    this.gamePlay.addLoadGameListener(this.onLoadGame);
  }

  onSaveGame() {
    this.stateService.save(this.state);
    /* eslint-disable */
    alert('Игра сохранена');
  }

  onLoadGame() {
    const load = this.stateService.load();
    this.state = GameState.from(load);

    this.gamePlay.switchTheme(this.state.theme);
    this.gamePlay.redrawPositions(this.state.characters);
  }

  onCellClick(index) {
    if (this.state.isOver) {
      return;
    }

    if (this.state.turn !== 'player') {
      return;
    }

    const active = this.state.characters.find((character) => character.position === index);

    if (this.selectedChar) {
      if (!active) {
        if (this.selectedChar.canMove(index)) {
          this.gamePlay.deselectCell(this.selectedChar.position);
          this.selectedChar.setPosition(index);
          this.selectedChar = null;
          this.gamePlay.deselectCell(index);
          this.gamePlay.redrawPositions(this.state.characters);
          this.endTurn();
        }
      } else if (active.character.isPlayerType()) {
        this.gamePlay.deselectCell(this.selectedChar.position);
        this.gamePlay.selectCell(index);
        this.selectedChar = active;
      } else if (this.selectedChar.canAttack(index)) {
        const dealtDamage = calculateDamage(this.selectedChar.character, active.character);
        active.character.health -= dealtDamage;

        this.gamePlay.deselectCell(this.selectedChar.position);
        this.selectedChar = null;

        this.gamePlay.showDamage(index, dealtDamage)
          .then(() => {
            this.gamePlay.setCursor(cursors.auto);
            this.gamePlay.deselectCell(index);
            this.gamePlay.redrawPositions(this.state.characters);
            this.endTurn();
          });
      }
    } else {
      if (!active) {
        return;
      }

      if (active.character.isPlayerType()) {
        this.gamePlay.selectCell(index);
        this.selectedChar = active;
      }
    }
  }

  onCellEnter(index) {
    if (this.state.isOver) {
      return;
    }

    const active = this.state.characters.find((character) => character.position === index);

    if (active) {
      if (active.character.isPlayerType()) {
        this.gamePlay.setCursor(cursors.pointer);
      }
      this.gamePlay.showCellTooltip(`🎖${active.character.level} ⚔${active.character.attack} 🛡${active.character.defence} ❤${active.character.health}`, index);
    }

    if (this.selectedChar) {
      if (active) {
        if (active.character.isPlayerType()) {
          this.gamePlay.setCursor(cursors.pointer);
          return;
        }

        if (this.selectedChar.canAttack(index)) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor(cursors.crosshair);
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }

        return;
      }

      if (this.selectedChar.position === index) {
        return;
      }

      if (this.selectedChar.canMove(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
    if (!this.selectedChar || this.selectedChar.position !== index) {
      this.gamePlay.deselectCell(index);
    }
  }

  onNewGame() {
    this.generateLevel(levels[0].level, levels[0].theme);
    this.state.isOver = false;
  }

  endTurn() {
    if (this.state.turn === 'player') {
      this.state.enemy = this.state.enemy.filter((enemy) => enemy.character.health > 0);
    } else {
      this.state.player = this.state.player.filter((player) => player.character.health > 0);
    }

    this.gamePlay.redrawPositions(this.state.characters);

    if (this.state.enemy.length === 0) {
      this.state.points = this.state.player
        .reduce((sum, player) => sum + player.character.health, 0);
      this.state.player.forEach((player) => player.character.levelUp());

      const nextLevel = levels.find((item) => item.level === this.state.level + 1);
      if (!nextLevel) {
        const record = localStorage.getItem('record');
        if (!record || record < this.state.points) {
          localStorage.setItem('record', this.state.points);
        }
        /* eslint-disable */
        alert(`Ура! Вы победили. Вы набрали ${this.state.points} очков`);
        this.state.isOver = true;
        return;
      }

      this.generateLevel(nextLevel.level, nextLevel.theme);
      return;
    }

    if (this.state.player.length === 0) {
      /* eslint-disable */
      alert('Game Over');
      return;
    }

    this.state.turn = this.state.turn === 'player' ? 'enemy' : 'player';
    if (this.state.turn === 'enemy') {
      this.computerLogic();
    }
  }

  generateLevel(level, theme) {
    const enemyTeam = [];
    const playerTeam = [];

    switch (level) {
      case 1: {
        const playerGenerator = generateTeam([Bowman, Swordsman], 1, 2);
        for (let i = 0; i < 2; i += 1) {
          playerTeam.push(playerGenerator.next().value);
        }

        const enemyGenerator = generateTeam([Daemon, Undead, Vampire], 1, 2);
        for (let i = 0; i < 2; i += 1) {
          enemyTeam.push(enemyGenerator.next().value);
        }
        break;
      }

      case 2: {
        this.state.player.forEach((player) => playerTeam.push(player.character));
        const playerGenerator = generateTeam([Bowman, Swordsman, Magician], 1, 1);
        playerTeam.push(playerGenerator.next().value);

        const enemyGenerator = generateTeam([Daemon, Undead, Vampire], 2, playerTeam.length);
        for (let i = 0; i < playerTeam.length; i += 1) {
          enemyTeam.push(enemyGenerator.next().value);
        }
        break;
      }

      case 3: {
        this.state.player.forEach((player) => playerTeam.push(player.character));
        const playerGenerator = generateTeam([Bowman, Swordsman, Magician], 2, 2);
        for (let i = 0; i < 2; i += 1) {
          playerTeam.push(playerGenerator.next().value);
        }

        const enemyGenerator = generateTeam([Daemon, Undead, Vampire], 3, playerTeam.length);
        for (let i = 0; i < playerTeam.length; i += 1) {
          enemyTeam.push(enemyGenerator.next().value);
        }
        break;
      }

      case 4: {
        this.state.player.forEach((player) => playerTeam.push(player.character));
        const playerGenerator = generateTeam([Bowman, Swordsman, Magician], 3, 2);
        for (let i = 0; i < 2; i += 1) {
          playerTeam.push(playerGenerator.next().value);
        }

        const enemyGenerator = generateTeam([Daemon, Undead, Vampire], 4, playerTeam.length);
        for (let i = 0; i < playerTeam.length; i += 1) {
          enemyTeam.push(enemyGenerator.next().value);
        }
        break;
      }

      default:
    }

    this.state.player = generatePositionedCharacters(playerTeam, 0, 1);
    this.state.enemy = generatePositionedCharacters(enemyTeam, 6, 7);

    this.state.level = level;
    this.state.theme = theme;
    this.state.turn = 'player';
    this.gamePlay.switchTheme(theme);
    this.gamePlay.redrawPositions(this.state.characters);
  }

  computerLogic() {
    let attackTarget = null;
    this.state.enemy.forEach((enemy) => {
      this.state.player.filter((player) => enemy.possibleAttacks.includes(player.position))
        .forEach((player) => {
          const coef = calculateDamage(enemy.character, player.character) / player.character.health;
          if (!attackTarget || attackTarget.coef < coef) {
            attackTarget = {
              attacker: enemy,
              defender: player,
              coef,
            };
          }
        });
    });

    if (attackTarget) {
      const { attacker, defender } = attackTarget;
      const damage = calculateDamage(attacker.character, defender.character);
      defender.character.health -= damage;
      this.gamePlay.showDamage(defender.position, damage)
        .then(() => {
          this.gamePlay.redrawPositions(this.state.characters);
          this.endTurn();
        });
      return;
    }

    const blockedCells = this.state.characters.map((char) => char.position);

    let moveTarget = null;
    this.state.enemy.forEach((enemy) => {
      enemy.possibleMoves.forEach((cell) => {
        if (blockedCells.includes(cell)) {
          return;
        }

        const attackCells = getPossibleAttackCells(enemy.character.type, cell);
        this.state.player.filter((player) => attackCells.includes(player.position))
          .forEach((player) => {
            const { character: enemyChar } = enemy;
            const { character: playerChar } = player;
            const coef = calculateDamage(enemyChar, playerChar) / playerChar.health;
            if (!moveTarget || moveTarget.coef < coef) {
              moveTarget = {
                enemy,
                cell,
                coef,
              };
            }
          });
      });
    });

    if (moveTarget) {
      moveTarget.enemy.setPosition(moveTarget.cell);
      this.gamePlay.redrawPositions(this.state.characters);
      this.endTurn();
      return;
    }

    const enemyIndex = randomInteger(0, this.state.enemy.length - 1);
    const enemy = this.state.enemy[enemyIndex];

    let moveIndex = randomInteger(0, enemy.possibleMoves.length - 1);
    while (blockedCells.includes(enemy.possibleMoves[moveIndex])) {
      moveIndex = randomInteger(0, enemy.possibleMoves.length - 1);
    }

    enemy.setPosition(enemy.possibleMoves[moveIndex]);
    this.gamePlay.redrawPositions(this.state.characters);
    this.endTurn();
  }
}
