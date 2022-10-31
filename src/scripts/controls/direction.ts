import { Direction } from "../../typings/direction";
import { PlayerControls } from "./playerControls";

const diagonalFactor = Math.sqrt(2) / 2;

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

  public static fromControls(playerControls: PlayerControls): DirectionVector {
    let horizontal = +playerControls.right() - +playerControls.left();
    let vertical = +playerControls.down() - +playerControls.up();
    if (horizontal && vertical) {
      horizontal *= diagonalFactor;
      vertical *= diagonalFactor;
    }
    return new DirectionVector(horizontal, vertical);
  }

  public getDirection(): Direction {
    const [x, y] = this.unit;
    if (x > 0 && y > 0) return Direction.DownRight;
    if (x > 0 && y < 0) return Direction.UpRight;
    if (x < 0 && y > 0) return Direction.DownLeft;
    if (x < 0 && y < 0) return Direction.UpLeft;
    if (x > 0) return Direction.Right;
    if (x < 0) return Direction.Left;
    if (y > 0) return Direction.Down;
    if (y < 0) return Direction.Up;
    return Direction.Down;
  }

  public getUnitVector(): [number, number] {
    return this.unit;
  }

  public getSpeed(speed: number): [number, number] {
    const [x, y] = this.unit;
    return [x * speed, y * speed];
  }
}
