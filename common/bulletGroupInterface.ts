import Gun from "./guns/gun";
import PlayerModel from "./playerModel";

export default abstract class BulletGroupInterface {
    public abstract shoot(x: number, y: number, rotation: number, shooter: PlayerModel, origin: Gun): void;
}