import { Direction, UnitVector } from "../types/direction.js";

export type EncodedMovementDirection = [UnitVector, UnitVector];

// See getFacingDirection method
const VERTICAL_THRESHOLD = Math.tan(Math.PI / 3);
const DIAGONAL_THRESHOLD = Math.tan(Math.PI / 6);

export default class MovementDirection {
  movement: UnitVector;
  facing: UnitVector;

  constructor(x = 0, y = 0, facingDirection: UnitVector = [0, 1]) {
    this.movement = [0, 0];
    this.facing = facingDirection;
    if (!x && !y) return;

    const magnitude2 = x * x + y * y;
    if (Math.abs(magnitude2 - 1) > Number.EPSILON) {
      const magnitude = Math.sqrt(magnitude2);
      this.movement = [x / magnitude, y / magnitude];
    } else {
      this.movement = [x, y];
    }

    this.facing = this.movement;
  }

  public static decode([
                         [x, y],
                         initial
                       ]: EncodedMovementDirection): MovementDirection {
    return new MovementDirection(x, y, initial);
  }

  private static getSpeed([x, y]: UnitVector, speed: number): UnitVector {
    return [x * speed, y * speed];
  }

  // Updates the movement according to the given direction.
  // If it's a null vector, it stops the movement but doesn't

  public encode(): EncodedMovementDirection {
    return [this.movement, this.facing];
  }

  // change the direction that the entity is facing
  public update(newDirection: UnitVector) {
    this.movement = newDirection;

    if (this.isMoving()) this.facing = this.movement;
  }

  public isMoving(): boolean {
    const [x, y] = this.movement;
    return Boolean(x || y);
  }

  // Returns a unit vector of the current movement direction.

  // Gets the current facing direction
  public getFacingDirection(): Direction {
    // Splits the first quadrant in 3 regions for each of the
    // directions. Then uses that information with the sign of
    // the coordinates to determine the direction.
    const [x, y] = this.facing;
    const [mX, mY] = [Math.abs(x), Math.abs(y)];

    if (mY > VERTICAL_THRESHOLD * mX) {
      if (y > 0) return Direction.Down;
      return Direction.Up;
    } else if (mY < DIAGONAL_THRESHOLD * mX) {
      if (x > 0) return Direction.Right;
      return Direction.Left;
    }
    if (x > 0) {
      if (y > 0) return Direction.DownRight;
      return Direction.UpRight;
    }
    if (y > 0) return Direction.DownLeft;
    return Direction.UpLeft;
  }

  // If there's no movement, it returns a null vector.
  public getUnitVector(): UnitVector {
    return this.movement;
  }

  // Returns a speed vector in with the given magnitude at the movement direction

  // Might be a null vector if it isn't currently moving
  public getSpeed(speed: number): UnitVector {
    return MovementDirection.getSpeed(this.movement, speed);
  }

  // Returns a speed vector in with the given magnitude at the facing direction
  public getFacingSpeed(speed: number): UnitVector {
    return MovementDirection.getSpeed(this.facing, speed);
  }
}
