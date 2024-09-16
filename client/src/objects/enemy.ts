import { EnemyState } from "../../../common/types/state";
import Phaser from "phaser";
import { EnemyModel } from "../../../common/enemy/enemyModel.js";
import EnemyPhysiqueModel from "../../../common/enemy/enemyPhysiqueModel";
import Observer from "../../../common/observer/observer";
import EnemyPhysique from "./enemyPhysique";
import { polarToCartesian } from "../../../common/utils";
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
    this.action = state.action;
    
    this.visible = state.spawned;
    this.active = state.spawned;
    this.body.enable = state.physique.health > 0;
  }

  private move(state: EnemyState) {
    this.setPosition(state.position.x, state.position.y);
    this.setDepth(state.position.y);

    this.setVelocity(...polarToCartesian(state.angle, this.physique.speed));
  }
}
