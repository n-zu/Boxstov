import { EnemyPhysiqueState } from "../../../../common/types/state.js";
import { Player } from "../../player/player";
import { Enemy } from "./enemy";

export default class EnemyPhysique {
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

    public setVelocityOf(enemy: Enemy) {
        enemy.setVelocity(...enemy.movementDirection.getSpeed(this.speed));
    }

    public getState(): EnemyPhysiqueState {
        return {
            maxHealth: this.maxHealth,
            health: this.health,
            strength: this.strength,
            speed: this.speed,
            attackRange: this.attackRange,
        };
    }

    public canAttack(me: Enemy, player: Player): boolean {
        const dx = player.x - me.x;
        const dy = player.y - me.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.attackRange;
    }
}