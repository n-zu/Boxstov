import { Direction, UnitVector } from "../types/direction.js";

export type EncodedMovementDirection = [UnitVector, UnitVector];

export default class MovementDirection {
  movement: UnitVector;
  facing: UnitVector;

  constructor(x = 0, y = 0, facingDirection: UnitVector = [0, 1]) {
    this.movement = [0, 0];
    this.facing = facingDirection;
    if (!x && !y) return;

    if (Math.abs(x ** 2 + y ** 2 - 1) > Number.EPSILON) {
      console.error("MovementDirection got invalid unit vector: ", x, y);
      return;
    }

    this.movement = [x, y];
    this.facing = this.movement;
  }

  public encode(): EncodedMovementDirection {
    return [this.movement, this.facing];
  }

  public static decode([
    [x, y],
    initial,
  ]: EncodedMovementDirection): MovementDirection {
    return new MovementDirection(x, y, initial);
  }

  public update(newDirection: UnitVector) {
    this.movement = newDirection;

    if (!this.isNullVector()) this.facing = this.movement;
  }

  public isNullVector(): boolean {
    const [x, y] = this.movement;
    return !x && !y;
  }

  public getFacingDirection(): Direction {
    const [x, y] = this.facing;
    if (x > 0 && y > 0) return Direction.DownRight;
    if (x > 0 && y < 0) return Direction.UpRight;
    if (x < 0 && y > 0) return Direction.DownLeft;
    if (x < 0 && y < 0) return Direction.UpLeft;
    if (x > 0) return Direction.Right;
    if (x < 0) return Direction.Left;
    if (y > 0) return Direction.Down;
    return Direction.Up;
  }

  public getUnitVector(): UnitVector {
    return this.movement;
  }

  private static getSpeed([x, y]: UnitVector, speed: number): UnitVector {
    return [x * speed, y * speed];
  }

  public getSpeed(speed: number): UnitVector {
    return MovementDirection.getSpeed(this.movement, speed);
  }

  public getFacingSpeed(speed: number): UnitVector {
    return MovementDirection.getSpeed(this.movement, speed);
  }
}
