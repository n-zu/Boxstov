import { DirectionEnum as DirectionEnumProto } from "../generated/utils/direction.js";

export function directionToRadians(direction: DirectionEnumProto): number {
  switch (direction) {
    case DirectionEnumProto.Up:
      return Math.PI * 1.5;
    case DirectionEnumProto.Down:
      return Math.PI * 0.5;
    case DirectionEnumProto.Left:
      return Math.PI;
    case DirectionEnumProto.Right:
      return 0;
    case DirectionEnumProto.UpLeft:
      return Math.PI * 1.25;
    case DirectionEnumProto.UpRight:
      return Math.PI * 1.75;
    case DirectionEnumProto.DownLeft:
      return Math.PI * 0.75;
    case DirectionEnumProto.DownRight:
      return Math.PI * 0.25;
    case DirectionEnumProto.UNRECOGNIZED:
      throw new Error("function: directionToRadians | action: received unrecognized direction");
  }
}

const directionMap: [DirectionEnumProto, number][] = [
  [DirectionEnumProto.Right, 0],
  [DirectionEnumProto.UpRight, Math.PI / 4],
  [DirectionEnumProto.Up, Math.PI / 2],
  [DirectionEnumProto.UpLeft, 3 * Math.PI / 4],
  [DirectionEnumProto.Left, Math.PI],
  [DirectionEnumProto.DownLeft, 5 * Math.PI / 4],
  [DirectionEnumProto.Down, 3 * Math.PI / 2],
  [DirectionEnumProto.DownRight, 7 * Math.PI / 4],
];

export function roundAngleToDirection(angle: number): DirectionEnumProto {
  const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);

  let closestDirection = DirectionEnumProto.Right;
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
