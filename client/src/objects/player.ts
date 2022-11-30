import { GameMaster } from "../gameMaster/gameMaster";
import * as Phaser from "phaser";
import { BulletGroup } from "../groups/bulletGroup";
import { Direction, UnitVector } from "../../../common/types/direction";
import MovementDirection from "../../../common/controls/direction";
import { PlayerRecentEvent, PlayerState } from "../../../common/types/state";
import { playAnimation } from "../scenes/mainScene";
import { AnimationSuffix } from "../types/animation";
import { PlayerUI } from "../controls/playerUi";
import { GunName, Guns } from "../../../common/guns";
import { PLAYER_SPEED } from "../../../common/constants";
import Observer from "../../../common/observer/observer.js";
import Sprite = Phaser.Physics.Arcade.Sprite;

const SYNC_DIFF_TOLERANCE = 0.001;

export class Player extends Sprite {
  scene: Phaser.Scene;
  gameMaster: GameMaster;
  bulletGroup: BulletGroup;
  observer: Observer;

  id: string;
  maxHealth = 100;
  health = 100;
  movementDirection: MovementDirection = new MovementDirection();
  ui: PlayerUI;
  local: boolean;
  gunName = GunName.Rifle;
  lastShootTime = 0;
  soundsAmount = 0;

  constructor(
    scene: Phaser.Scene,
    observer: Observer,
    id: string,
    gameMaster: GameMaster,
    bulletGroup: BulletGroup,
    local: boolean = false,
    x: number = 0,
    y: number = 0
  ) {
    super(scene, x, y, "player");
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.gameMaster = gameMaster;
    this.bulletGroup = bulletGroup;
    this.ui = new PlayerUI(scene, this.id, observer);
    this.local = local;
    this.observer = observer;

    playAnimation(this, this.gunName, Direction.Down, AnimationSuffix.Idle);
    this.subscribeToEvents();
  }

  public update() {
    this.observer.notify("playerUpdate", this);
  }

  moveTo(direction: UnitVector) {
    const previous = this.movementDirection.getUnitVector();
    this.movementDirection.update(direction);
    if (this.local && previous !== this.movementDirection.getUnitVector())
      this.sendMovementMessage(this.movementDirection);

    this.move();
  }

  move() {
    this.setVelocity(...this.movementDirection.getSpeed(PLAYER_SPEED));
    if (!this.movementDirection.isMoving()) {
      this.doStopMovement();
      return;
    }

    playAnimation(
      this,
      this.gunName,
      this.movementDirection.getFacingDirection(),
      AnimationSuffix.Run
    );
  }

  public sync(state: PlayerState) {
    this.syncPosition(state.position.x, state.position.y);
    this.syncEvents(state.events);

    this.health = state.health;
    if (this.local) {
      this.notifyInconsistencies(state);
    } else {
      this.movementDirection = MovementDirection.decode(
        state.movementDirection
      );
      this.move();
    }
    if (this.gunName !== state.gunName) {
      this.gunName = state.gunName;
      this.scene.sound.add("switch_gun", {
        volume: this.calculateSoundVolume()
      }).play();
    }
  }

  public getShootReloadTime(): number {
    const gun = Guns[this.gunName];
    return gun.reloadTime;
  }

  private isReloading(): boolean {
    return this.lastShootTime + this.getShootReloadTime() > Date.now();
  }

  private shoot() {
    if (this.isReloading()) return;

    this.lastShootTime = Date.now();
    this.gameMaster.send("player", {
      id: this.id,
      type: "shoot",
      gunName: this.gunName
    });
  }

  private subscribeToEvents() {
    if (this.local) {
      this.observer.subscribe("changeGun", (gunName: GunName) => {
        this.setGun(gunName);
      });
      this.observer.subscribe("playerMove", (direction: UnitVector) => {
        this.moveTo(direction);
      });
      this.observer.subscribe("playerShoot", () => {
        this.shoot();
      });
    }
  }

  private setGun(gunName: GunName) {
    this.gameMaster.send("player", {
      id: this.id,
      type: "switch_gun",
      gunName
    });
  }

  private notifyInconsistencies(state: PlayerState) {
    if (this.movementDirection.encode() !== state.movementDirection) {
      this.sendMovementMessage(this.movementDirection);
    }
  }

  private handleReceiveDamageEvent() {
    if (this.soundsAmount < 3) {
      this.soundsAmount++;
      this.scene.sound.add("player_receive_damage", {
        volume: this.calculateSoundVolume()
      }).once("complete", () => {
        this.soundsAmount--;
      }).play();
    }
  }

  private handleKillEvent() {
    // TODO: Kill sound
  }

  private handleUnlockGunEvent() {
    this.scene.sound.add("unlocked_gun", {
      volume: this.calculateSoundVolume()
    }).play();
  }

  private syncEvents(events: PlayerRecentEvent[]) {
    events.forEach(event => {
      switch (event) {
        case "shoot":
          this.handleShootEvent();
          break;
        case "receive_damage":
          this.handleReceiveDamageEvent();
          break;
        case "kill":
          this.handleKillEvent();
          break;
        case "unlocked_gun":
          this.handleUnlockGunEvent();
          break;
      }
    });
  }

  private calculateSoundVolume(): number {
    const camera = this.scene.cameras.main;
    const cameraX = camera.scrollX + camera.width / 2;
    const cameraY = camera.scrollY + camera.height / 2;

    const distance = Phaser.Math.Distance.Between(cameraX, cameraY, this.x, this.y);
    const maxDistance = Math.sqrt(Math.pow(camera.width, 2) + Math.pow(camera.height, 2));
    return 0.1 * (1 - distance / maxDistance);
  }

  private handleShootEvent() {
    Guns[this.gunName].playSound(this.calculateSoundVolume());
  }

  private doStopMovement() {
    this.setVelocity(0, 0);
    this.playIdleAnimation();
  }

  private syncPosition(x: number, y: number) {
    const diffX = Math.abs(this.x - x);
    const diffY = Math.abs(this.y - y);
    if (diffX > SYNC_DIFF_TOLERANCE || diffY > SYNC_DIFF_TOLERANCE) {
      this.setPosition(x, y);
      this.setDepth(y);
    }
  }

  private playIdleAnimation() {
    const animationName = `${
      this.gunName
    }-${this.movementDirection?.getFacingDirection()}-${AnimationSuffix.Idle}`;
    this.anims.play(animationName, true);
  }

  private sendMovementMessage(direction: MovementDirection) {
    this.gameMaster.send("player", {
      id: this.id,
      type: "move",
      direction: direction.encode()
    });
  }
}
