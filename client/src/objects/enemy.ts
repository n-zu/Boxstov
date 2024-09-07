import { playAnimation } from "../scenes/mainScene";
import { EnemyState } from "../../../common/types/state";
import { AnimationActor, AnimationSuffix } from "../types/animation";
import Phaser from "phaser";
import config from "../../../common/config";
import { EnemyModel } from "../../../common/enemy/enemyModel.js";
import EnemyPhysiqueModel from "../../../common/enemy/enemyPhysiqueModel";
import Observer from "../../../common/observer/observer";
import PlayerModel from "../../../common/playerModel";
import EnemyPhysique from "./enemyPhysique";
import { polarToCartesian } from "../../../common/utils";
import { roundAngleToDirection } from "../../../common/types/direction";
import { GameEvents } from "../../../common/types/events";

export class Enemy extends EnemyModel {
  action: string = "";

  constructor(
    id: number,
    scene: Phaser.Scene,
    position: { x: number; y: number },
    observer: Observer<GameEvents>,
    physique: EnemyPhysiqueModel
  ) {
    super(id, scene, position, observer, physique, "zombie");
  }

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

  public sync(state: EnemyState) {
    this.action = state.action;
    this.move(state);
    (this.physique as EnemyPhysique).sync(this, state.physique);
    this.setActive(state.active);
    this.setVisible(state.visible);
    this.active = state.active;
    this.action = state.action;
  }

  private changeColor() {
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => this.setTint(0xff5555));
    this.scene.time.delayedCall(200, () => this.setTint(0xffaaaa));
    this.scene.time.delayedCall(300, () => this.setTint(0xffffff));
  }

  public receiveDamage(damage: number, damager?: PlayerModel): void {
    super.receiveDamage(damage, damager);
    this.changeColor();
    this.observer.notify("enemyReceivedDamage", this);
  }

  private move(state: EnemyState) {
    this.setPosition(state.position.x, state.position.y);
    this.setDepth(state.position.y);

    this.setVelocity(...polarToCartesian(state.angle, this.physique.speed));

    const action =
      this.action === AnimationSuffix.Attack
        ? AnimationSuffix.Attack
        : this.physique.speed >= config.enemies.zombieNormal.speed
          ? AnimationSuffix.Run
          : AnimationSuffix.Walk;

    if (!this.physique.isDead()) {
      playAnimation(
        this,
        AnimationActor.Zombie,
        roundAngleToDirection(state.angle),
        action
      );
    }
  }

  public die(killer?: PlayerModel) {
    super.die(killer);
    this.setTint(0xff5555);
    setTimeout(() => this.setTint(0xffdddd), 1000);

    playAnimation(
      this,
      AnimationActor.Zombie,
      roundAngleToDirection(this.angle),
      AnimationSuffix.Die
    );
  }
}
