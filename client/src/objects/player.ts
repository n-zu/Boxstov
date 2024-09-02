import { GameMaster } from "../gameMaster/gameMaster";
import * as Phaser from "phaser";
import { BulletGroup } from "../groups/bulletGroup";
import { Direction, UnitVector } from "../../../common/types/direction";
import MovementDirection from "../../../common/controls/direction";
import { PlayerRecentEvent, PlayerState } from "../../../common/types/state";
import { playAnimation } from "../scenes/mainScene";
import { AnimationSuffix } from "../types/animation";
import { GunName, Guns } from "../../../common/guns";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events";
import Sprite = Phaser.Physics.Arcade.Sprite;
import config from "../../../common/config";

const SYNC_DIFF_TOLERANCE = 0.001;

export class Player extends Sprite {
  scene: Phaser.Scene;
  gameMaster: GameMaster;
  bulletGroup: BulletGroup;
  observer: Observer<GameEvents>;

  id: string;
  maxHealth = config.player.health;
  health = this.maxHealth;
  movementDirection: MovementDirection = new MovementDirection();
  local: boolean;
  gunName = GunName.Rifle;
  lastShootTime = 0;

  constructor(
    scene: Phaser.Scene,
    observer: Observer<GameEvents>,
    id: string,
    gameMaster: GameMaster,
    bulletGroup: BulletGroup,
    local = false,
    x = 0,
    y = 0
  ) {
    super(scene, x, y, GunName.Rifle);
    this.scene = scene;

    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setBodySize(config.player.size.width, config.player.size.height);
    this.setCollideWorldBounds(true);
    
    this.id = id;
    this.gameMaster = gameMaster;
    this.bulletGroup = bulletGroup;
    this.local = local;
    this.observer = observer;
    this.observer.notify("newPlayer", this);

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
    this.setVelocity(...this.movementDirection.getSpeed(config.player.speed));
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

  public sync(state: PlayerState, recentEvents: PlayerRecentEvent[]) {
    this.syncPosition(state.position.x, state.position.y);
    this.syncEvents(recentEvents);

    this.health = state.health;
    if (this.health <= 0) {
      this.observer.notify("playerDied", this);
    }

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
      this.observer.notify("playerSwitchedGun", this);
    }
  }

  public getShootReloadTime(): number {
    const gun = Guns[this.gunName];
    return gun.reloadTime;
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
      this.observer.subscribe("triggerChangeGun", (gunName: GunName) => {
        this.setGun(gunName);
      });
      this.observer.subscribe("triggerMove", (direction) => {
        this.moveTo(direction);
      });
      this.observer.subscribe("triggerShoot", () => {
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

  private syncEvents(events: PlayerRecentEvent[]) {
    events.forEach(event => {
      switch (event) {
        case "shoot":
          this.observer.notify("playerShoot", this);
          break;
        case "receive_damage":
          this.observer.notify("playerReceivedDamage", this);
          break;
        case "kill":
          this.observer.notify("playerKill", this);
          break;
        case "unlocked_gun":
          this.observer.notify("playerUnlockedGun", this);
          break;
      }
    });
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
