export function calcTileType(index, boardSize) {
  if (index === 0) {
    return 'top-left';
  }
  if (index > 0 && index < boardSize - 1) {
    return 'top';
  }
  if (index === boardSize - 1) {
    return 'top-right';
  }

  const remainder = index % boardSize;
  if (remainder === 0) {
    if (index === boardSize * (boardSize - 1)) {
      return 'bottom-left';
    }
    return 'left';
  }

  if (remainder === boardSize - 1) {
    if (index === boardSize ** 2 - 1) {
      return 'bottom-right';
    }
    return 'right';
  }

  if (index > boardSize * (boardSize - 1) && index < boardSize ** 2 - 1) {
    return 'bottom';
  }

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function calculateLevelUpAbility(value, healthPercent) {
  return Math.max(value, Math.round(value * (1 + 0.7 * healthPercent)));
}

export function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
