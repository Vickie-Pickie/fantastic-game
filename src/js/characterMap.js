const characterMap = {
  bowman: {
    attack: 25,
    defence: 25,
    health: 100,
    level: 1,
    team: 'player',
    rules: {
      move: 2,
      attack: 2,
    },
  },
  swordsman: {
    attack: 40,
    defence: 10,
    health: 100,
    level: 1,
    team: 'player',
    rules: {
      move: 4,
      attack: 1,
    },
  },
  magician: {
    attack: 10,
    defence: 40,
    health: 100,
    level: 1,
    team: 'player',
    rules: {
      move: 1,
      attack: 4,
    },
  },
  daemon: {
    attack: 10,
    defence: 40,
    health: 100,
    level: 1,
    team: 'enemy',
    rules: {
      move: 1,
      attack: 4,
    },
  },
  undead: {
    attack: 40,
    defence: 10,
    health: 100,
    level: 1,
    team: 'enemy',
    rules: {
      move: 4,
      attack: 1,
    },
  },
  vampire: {
    attack: 25,
    defence: 25,
    health: 100,
    level: 1,
    team: 'enemy',
    rules: {
      move: 2,
      attack: 2,
    },
  },
};

export default characterMap;
