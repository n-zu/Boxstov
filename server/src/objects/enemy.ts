import { EnemyModel } from "../../../common/enemy/enemyModel.js";
import { EnemyState } from "../../../common/types/state";

export default class Enemy extends EnemyModel {
    public getState(): EnemyState {
        const physiqueState = this.physique.getState();
        const state = {
            position: {
                x: this.x,
                y: this.y,
            },
            // FIXME: This is a hack to avoid refactoring the client right now
            dead: this.physique.isDead(),
            health: physiqueState.health,
            speed: physiqueState.speed,
            action: this.brain.action,
            active: this.active,
            visible: this.visible,
            bodyEnabled: this.body.enable,
            movementDirection: this.movementDirection.encode(),
        };
        return state;
    }
}