export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
  UpLeft = "upLeft",
  UpRight = "upRight",
  DownLeft = "downLeft",
  DownRight = "downRight",
}

export function directionToRadians(direction: Direction): number {
  switch (direction) {
    case Direction.Up:
      return Math.PI * 1.5;
    case Direction.Down:
      return Math.PI * 0.5;
    case Direction.Left:
      return Math.PI;
    case Direction.Right:
      return 0;
    case Direction.UpLeft:
      return Math.PI * 1.25;
    case Direction.UpRight:
      return Math.PI * 1.75;
    case Direction.DownLeft:
      return Math.PI * 0.75;
    case Direction.DownRight:
      return Math.PI * 0.25;
  }
}

const directionMap: [Direction, number][] = [
  [Direction.Right, 0],
  [Direction.UpRight, Math.PI / 4],
  [Direction.Up, Math.PI / 2],
  [Direction.UpLeft, 3 * Math.PI / 4],
  [Direction.Left, Math.PI],
  [Direction.DownLeft, 5 * Math.PI / 4],
  [Direction.Down, 3 * Math.PI / 2],
  [Direction.DownRight, 7 * Math.PI / 4],
];

export function roundAngleToDirection(angle: number): Direction {
  const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);

  let closestDirection = Direction.Right;
  let smallestDifference = Number.MAX_VALUE;

  for (const [direction, dirAngle] of directionMap) {
    const diff = Math.abs(normalizedAngle - dirAngle);
    if (diff < smallestDifference) {
      smallestDifference = diff;
      closestDirection = direction;
    }
  }

  return closestDirection;
}

export type UnitVector = [number, number];
