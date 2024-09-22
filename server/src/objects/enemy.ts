import { EnemyModel } from "../../../common/enemy/enemyModel.js";
import { EnemyState } from "../../../common/types/state";
import EnemyPhysique from "./enemyPhysique.js";

export default class Enemy extends EnemyModel {
    public getState(): EnemyState {
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