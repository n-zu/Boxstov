import EnemyPhysiqueModel from "../../../common/enemy/enemyPhysiqueModel.js";
import { EnemyPhysiqueState } from "../../../common/types/state";

export default class EnemyPhysique extends EnemyPhysiqueModel {
    public getState(): EnemyPhysiqueState {
        return {
            maxHealth: this.maxHealth,
            health: this.health,
            strength: this.strength,
            speed: this.speed,
            attackRange: this.attackRange,
        };
    }
}