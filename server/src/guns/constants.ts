import { Direction } from "../../../common/types/direction.js";

export const GUN_OFFSETS = {
    "moving": {
      [Direction.Right]: [200, -95],
      [Direction.Left]: [-170, -110],
      [Direction.Up]: [10, -230],
      [Direction.Down]: [-12, 50],
      [Direction.UpLeft]: [-135, -185],
      [Direction.UpRight]: [150, -180],
      [Direction.DownLeft]: [-175, -10],
      [Direction.DownRight]: [150, -10]
    },
    "idle": {
      [Direction.Right]: [200, -105],
      [Direction.Left]: [-170, -120],
      [Direction.Up]: [15, -230],
      [Direction.Down]: [-20, 40],
      [Direction.UpLeft]: [-125, -195],
      [Direction.UpRight]: [150, -180],
      [Direction.DownLeft]: [-180, -30],
      [Direction.DownRight]: [150, -20]
    }
  };
  
export const GUN_ROTATIONS = {
    [Direction.Right]: 0,
    [Direction.Left]: Math.PI,
    [Direction.Up]: -Math.PI / 2,
    [Direction.Down]: Math.PI / 2,
    [Direction.UpLeft]: -3 * Math.PI / 4 - 0.3,
    [Direction.UpRight]: -Math.PI / 4 + 0.3,
    [Direction.DownLeft]: 3 * Math.PI / 4 + 0.3,
    [Direction.DownRight]: Math.PI / 4 - 0.3
};