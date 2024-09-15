import EnemyPhysiqueModel from "../../../common/enemy/enemyPhysiqueModel";
import { EnemyPhysiqueState } from "../../../common/types/state";
import { Enemy } from "./enemy";

export default class EnemyPhysique extends EnemyPhysiqueModel {
    public sync(enemy: Enemy, state: EnemyPhysiqueState) {
        if (state.health > 0) {
            this.updateHealth(enemy, state.health);
        }
        if (!this.isDead() && state.health <= 0) {
            enemy.die();
        }
        
        // TODO: Check if there is anything else that needs to be synced
        this.maxHealth = state.maxHealth;
        this.strength = state.strength;
        this.health = state.health;
        this.speed = state.speed;
    }

    private updateHealth(enemy: Enemy, newHealth: number) {
        if (newHealth < this.health) {
            enemy.receiveDamage(this.health - newHealth);
        }
    }
}