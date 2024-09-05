import Gun from "./guns/gun";

export default abstract class BulletGroupInterface {
    public abstract shoot(x: number, y: number, rotation: number, shooterId: string, origin: Gun): void;
}