import EnemyPhysiqueModel from "../../../common/enemy/enemyPhysiqueModel.js";
import { EnemyPhysique as EnemyPhysiqueProto } from "../../../common/generated/enemy/enemyPhysique.js";

export default class EnemyPhysique extends EnemyPhysiqueModel {
    public getState(): EnemyPhysiqueProto {
        return {
            maxHealth: this.maxHealth,
            health: this.health,
            strength: this.strength,
            speed: this.speed,
            attackRange: this.attackRange,
        };
    }
}