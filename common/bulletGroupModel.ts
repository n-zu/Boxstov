import { BulletModel } from "./bulletModel";
import Gun from "./guns/gun";
import Observer from "./observer/observer";
import PlayerModel from "./playerModel";
import { GameEvents } from "./types/events";

const MAX_BULLETS = 30;

export class BulletGroupModel extends Phaser.Physics.Arcade.Group {
    observer: Observer<GameEvents>;

    constructor(scene: Phaser.Scene, observer: Observer<GameEvents>,
        bulletFactory: (scene: Phaser.Scene, observer: Observer<GameEvents>) => BulletModel) {
        super(scene.physics.world, scene);

        this.observer = observer;
        function factory() {
            return bulletFactory(scene, observer);
        }

        this.createMultiple({
            frameQuantity: 30,
            key: "bullet",
            active: false,
            visible: false,
            classType: factory,
        });
    }

    public shoot(x: number, y: number, rotation: number, shooter: PlayerModel, origin: Gun): void {
        const bullet = this.getFirstDead(false) as BulletModel;
        if (bullet) {
            bullet.fire(x, y, rotation, shooter, origin);
        }
    }
}
