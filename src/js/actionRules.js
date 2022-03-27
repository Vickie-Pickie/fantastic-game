import characterMap from './characterMap';

export function getPossibleMoveCells(charType, startIndex) {
  const moveLength = characterMap[charType].rules.move;
  const leftpadding = startIndex % 8;
  const rightpadding = 8 - 1 - leftpadding;
  const leftMove = Math.min(moveLength, leftpadding);
  const rightMove = Math.min(moveLength, rightpadding);
  const moveCells = [];

  for (let i = startIndex - leftMove; i <= startIndex + rightMove; i += 1) {
    if (i === startIndex) {
      /* eslint-disable */
      continue;
    }
    moveCells.push(i);
  }

  for (let i = 1; i <= moveLength; i += 1) {
    const offset = 8 * i;
    const topCell = startIndex - offset;
    if (topCell >= 0) {
      moveCells.push(topCell);

      if (leftpadding >= i) {
        moveCells.push(topCell - i);
      }

      if (rightpadding >= i) {
        moveCells.push(topCell + i);
      }
    }

    const bottomCell = startIndex + offset;
    if (bottomCell < 64) {
      moveCells.push(bottomCell);

      if (leftpadding >= i) {
        moveCells.push(bottomCell - i);
      }

      if (rightpadding >= i) {
        moveCells.push(bottomCell + i);
      }
    }
  }

  return moveCells;
}

export function getPossibleAttackCells(charType, startIndex) {
  const attackRadius = characterMap[charType].rules.attack;
  const leftpadding = startIndex % 8;
  const rightpadding = 8 - 1 - leftpadding;
  const leftOffset = Math.min(attackRadius, leftpadding);
  const rightOffset = Math.min(attackRadius, rightpadding);
  const attackCells = [];

  for (let i = 0; i <= attackRadius; i += 1) {
    const vertOffset = i * 8;
    let centerPos = startIndex - vertOffset;

    if (centerPos >= 0) {
      for (let j = centerPos - leftOffset; j <= centerPos + rightOffset; j += 1) {
        if (j === startIndex) {
          /* eslint-disable */
          continue;
        }
        attackCells.push(j);
      }
    }

    if (i === 0) {
      /* eslint-disable */
      continue;
    }

    centerPos = startIndex + vertOffset;

    if (centerPos < 64) {
      for (let i = centerPos - leftOffset; i <= centerPos + rightOffset; i += 1) {
        attackCells.push(i);
      }
    }
  }

  return attackCells;
}

export function calculateDamage(attacker, defender) {
  return Math.max(attacker.attack - Math.round(defender.defence / 3), attacker.attack * 0.2);
}
