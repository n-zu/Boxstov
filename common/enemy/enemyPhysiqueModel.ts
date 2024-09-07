import { EnemyPhysiqueState } from "../types/state.js";
import { EnemyModel } from "./enemyModel.js";
import PlayerModel from "../playerModel.js";
import { polarToCartesian } from "../utils.js";

export default class EnemyPhysiqueModel {
    maxHealth: number;
    health: number;
    strength: number;
    speed: number;
    attackRange: number;

    constructor(
        health: number,
        strength: number,
        speed: number,
        attackRange: number
    ) {
        this.maxHealth = health;
        this.health = health;
        this.strength = strength;
        this.speed = speed;
        this.attackRange = attackRange;
    }

    public resetHealth() {
        this.health = this.maxHealth;
    }

    public receiveDamage(damage: number) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;    
        }
    }

    public isDead() {
        return this.health == 0;
    }

    public setVelocityOf(enemy: EnemyModel) {
        const v = polarToCartesian(enemy.angle, this.speed);
        // We need to invert the y component because in the canvas, the y axis is inverted
        enemy.setVelocity(v[0], -v[1]);
    }

    public canAttack(me: EnemyModel, player: PlayerModel): boolean {
        const dx = player.x - me.x;
        const dy = player.y - me.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.attackRange;
    }
}