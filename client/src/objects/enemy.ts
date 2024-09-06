import { playAnimation } from "../scenes/mainScene";
import { EnemyRecentEvents, EnemyState } from "../../../common/types/state";
import { AnimationActor, AnimationSuffix } from "../types/animation";
import MovementDirection from "../../../common/controls/direction";
import Phaser from "phaser";
import config from "../../../common/config";
import { EnemyModel } from "../../../common/enemy/enemyModel.js";

// FIXME: This should not be here 
const HEALTH = config.enemies.zombieNormal.health;

export class Enemy extends EnemyModel {
  action: string = "";

  public getDistanceToCamera(): number {
    const camera = this.scene.cameras.main;
    const cameraX = camera.scrollX + camera.width / 2;
    const cameraY = camera.scrollY + camera.height / 2;

    return Phaser.Math.Distance.Between(cameraX, cameraY, this.x, this.y);
  }

  public getMaxDistanceToCamera(): number {
    const camera = this.scene.cameras.main;
    return Math.sqrt(Math.pow(camera.width, 2) + Math.pow(camera.height, 2));
  }

  public sync(state: EnemyState, recentEvents: EnemyRecentEvents[]) {
    this.syncEvents(recentEvents);

    if (state.health > 0) {
      this.updateHealth(state.health);
    }
    this.move(state);
    if (!this.physique.isDead() && state.dead) {
      this.die();
    }
    this.setActive(state.active);
    this.setVisible(state.visible);
    this.active = state.active;
    this.action = state.action;
    // TODO: Check if there is anything else that needs to be synced
    this.physique.health = state.health;
    this.physique.speed = state.speed;
  }

  private syncEvents(events: EnemyRecentEvents[]) {
    /*
    events.forEach((event) => {
      switch (event) {
        case "receive_damage":
          this.observer.notify("enemyReceivedDamage", this);
          this.changeColor();
          break;
      }
    });
    */
  }

  private changeColor() {
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => this.setTint(0xff5555));
    this.scene.time.delayedCall(200, () => this.setTint(0xffaaaa));
    this.scene.time.delayedCall(300, () => this.setTint(0xffffff));
  }

  private updateHealth(newHealth: number) {
    if (newHealth < this.physique.health) this.receiveDamage(this.physique.health - newHealth);
  }

  private move(state: EnemyState) {
    this.setPosition(state.position.x, state.position.y);
    this.setDepth(state.position.y);

    this.movementDirection = MovementDirection.decode(state.movementDirection);
    this.setVelocity(...this.movementDirection.getSpeed(this.physique.speed));
    
    const action =
      this.action === AnimationSuffix.Attack
        ? AnimationSuffix.Attack
        : this.physique.speed >= config.enemies.zombieNormal.speed
        ? AnimationSuffix.Run
        : AnimationSuffix.Walk;
    
    if (this.movementDirection.isMoving()) {
      playAnimation(
        this,
        AnimationActor.Zombie,
        this.movementDirection.getFacingDirection(),
        action
      );
    }
  }

  private die() {
    this.setTint(0xff5555);
    setTimeout(() => this.setTint(0xffdddd), 1000);
    this.setDepth(this.y - 100);

    playAnimation(
      this,
      AnimationActor.Zombie,
      this.movementDirection.getFacingDirection(),
      AnimationSuffix.Die
    );
    this.setRotation(Math.random() * 0.4 - 0.2);

    this.scene.time.delayedCall(10000, () => {
      this.setVisible(false);
      this.setActive(false);
    });
  }
}
