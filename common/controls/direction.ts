import { Direction, UnitVector } from "../types/direction.js";

export default class DirectionVector {
  unit: [number, number];

  constructor(x = 0, y = 0) {
    this.unit = [0, 0];
    if (!x && !y) return;

    if (Math.abs(x ** 2 + y ** 2 - 1) > Number.EPSILON) {
      console.error("DirectionVector got invalid unit vector: ", x, y);
      return;
    }

    this.unit = [x, y];
  }

  static fromUnitVector([x, y]: UnitVector): DirectionVector {
    return new DirectionVector(x, y);
  }

  public getDirection(): Direction | null {
    const [x, y] = this.unit;
    if (x > 0 && y > 0) return Direction.DownRight;
    if (x > 0 && y < 0) return Direction.UpRight;
    if (x < 0 && y > 0) return Direction.DownLeft;
    if (x < 0 && y < 0) return Direction.UpLeft;
    if (x > 0) return Direction.Right;
    if (x < 0) return Direction.Left;
    if (y > 0) return Direction.Down;
    if (y < 0) return Direction.Up;
    if (y > 0) return Direction.Down;
    return null;
  }

  public getUnitVector(): UnitVector {
    return this.unit;
  }

  public getSpeed(speed: number): UnitVector {
    const [x, y] = this.unit;
    return [x * speed, y * speed];
  }
}
