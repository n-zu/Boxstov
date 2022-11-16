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

  // Updates the movement according to the given direction.
  // If it's a null vector, it stops the movement but doesn't
  // change the direction that the entity is facing
  public update(newDirection: UnitVector) {
    this.movement = newDirection;

    if (this.isMoving()) this.facing = this.movement;
  }

  public isMoving(): boolean {
    const [x, y] = this.movement;
    return Boolean(x || y);
  }

  // Gets the current facing direction
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

  // Returns an unit vector of the current movement direction.
  // If there's no movement, it returns a null vector.
  public getUnitVector(): UnitVector {
    return this.movement;
  }

  private static getSpeed([x, y]: UnitVector, speed: number): UnitVector {
    return [x * speed, y * speed];
  }

  // Returns a speed vector in with the given magnitude at the movement direction
  // Might be a null vector if it isn't curently moving
  public getSpeed(speed: number): UnitVector {
    return MovementDirection.getSpeed(this.movement, speed);
  }

  // Returns a speed vector in with the given magnitude at the facing direction
  public getFacingSpeed(speed: number): UnitVector {
    return MovementDirection.getSpeed(this.movement, speed);
  }
}
