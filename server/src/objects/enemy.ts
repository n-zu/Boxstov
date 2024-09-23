import { EnemyModel } from "../../../common/enemy/enemyModel.js";
import EnemyPhysique from "./enemyPhysique.js";
import { Enemy as EnemyProto } from "../../../common/generated/enemy/enemy.js";

export default class Enemy extends EnemyModel {
    public getState(): EnemyProto {
        const state = {
            position: {
                x: this.x,
                y: this.y,
            },
            physique: (this.physique as EnemyPhysique).getState(),
            dead: this.physique.isDead(),
            action: this.brain.action,
            spawned: this.active,
            angle: this.angle
        };
        return state;
    }
}