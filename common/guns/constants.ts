import { DirectionEnum as DirectionEnumProto } from "../generated/utils/direction.js";

export const GUN_OFFSETS = {
    "moving": {
        [DirectionEnumProto.Right]: [200, -95],
        [DirectionEnumProto.Left]: [-170, -110],
        [DirectionEnumProto.Up]: [10, -230],
        [DirectionEnumProto.Down]: [-12, 50],
        [DirectionEnumProto.UpLeft]: [-135, -185],
        [DirectionEnumProto.UpRight]: [150, -180],
        [DirectionEnumProto.DownLeft]: [-175, -10],
        [DirectionEnumProto.DownRight]: [150, -10],
        [DirectionEnumProto.UNRECOGNIZED]: [0, 0] // Should never be used
    },
    "idle": {
        [DirectionEnumProto.Right]: [200, -105],
        [DirectionEnumProto.Left]: [-170, -120],
        [DirectionEnumProto.Up]: [15, -230],
        [DirectionEnumProto.Down]: [-20, 40],
        [DirectionEnumProto.UpLeft]: [-125, -195],
        [DirectionEnumProto.UpRight]: [150, -180],
        [DirectionEnumProto.DownLeft]: [-180, -30],
        [DirectionEnumProto.DownRight]: [150, -20],
        [DirectionEnumProto.UNRECOGNIZED]: [0, 0] // Should never be used
    }
};

export const GUN_ROTATIONS = {
    [DirectionEnumProto.Right]: 0,
    [DirectionEnumProto.Left]: Math.PI,
    [DirectionEnumProto.Up]: -Math.PI / 2,
    [DirectionEnumProto.Down]: Math.PI / 2,
    [DirectionEnumProto.UpLeft]: -3 * Math.PI / 4 - 0.3,
    [DirectionEnumProto.UpRight]: -Math.PI / 4 + 0.3,
    [DirectionEnumProto.DownLeft]: 3 * Math.PI / 4 + 0.3,
    [DirectionEnumProto.DownRight]: Math.PI / 4 - 0.3,
    [DirectionEnumProto.UNRECOGNIZED]: 0 // Should never be used
};