
import MovementDirection from "../../../common/controls/direction.js";

import { GunName, Guns } from "../../../common/guns.js";
import { KILLS_TO_UNLOCK } from "../../../common/constants.js";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events";
import Gun from "../guns/gun";
import Rifle from "../guns/rifle.js";
import { BulletGroup } from "../groups/bulletGroup";
import Shotgun from "../guns/shotgun.js";
import Rpg from "../guns/rpg.js";
import { GUN_OFFSETS, GUN_ROTATIONS } from "../guns/constants.js";

export default class PlayerArsenal {
    playerId: string;
    kills: number;
    currentGun: Gun;
    bullets: BulletGroup;
    observer: Observer<GameEvents>;

    constructor(playerId: string, bullets: BulletGroup, observer: Observer<GameEvents>) {
        this.playerId = playerId;
        this.kills = 0;
        this.bullets = bullets;
        this.currentGun = new Rifle(bullets);
        this.observer = observer;
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        this.observer.subscribe("enemyKilled", (killerId: string) => {
            if (this.playerId === killerId) {
              this.kills++;
              for (const gunName of Object.keys(Guns)) {
                if (this.kills === KILLS_TO_UNLOCK[gunName as GunName]) {
                  this.observer.notify("unlockedGun", this.playerId);
                }
              }
            }
          });
    }

    private has(gunName: GunName): boolean {
        return this.kills >= KILLS_TO_UNLOCK[gunName];
    }

    public shoot(playerX: number, playerY: number, movementDirection: MovementDirection) {
      const rotation = GUN_ROTATIONS[movementDirection.getFacingDirection()] as number;
      const [xGun, yGun] = this.getGunOffset(movementDirection);
      
      this.currentGun.shoot(playerX + xGun, playerY + yGun, this.playerId, rotation);

      this.observer.notify("shootBullet", {
        x: playerX + xGun,
        y: playerY + yGun,
        rotation,
        gunName: this.currentGun.getGunName(),
        playerId: this.playerId
      });
    }

    public switchGun(gunName: GunName) {
        if (this.has(gunName)) {
            switch (gunName) {
                case GunName.Rifle:
                    this.currentGun = new Rifle(this.bullets);
                    break;
                case GunName.Shotgun:
                    this.currentGun = new Shotgun(this.bullets);
                    break;
                case GunName.Rpg:
                    this.currentGun = new Rpg(this.bullets);
                    break;
            }
        }
    }

    private getGunOffset(movementDirection: MovementDirection): [number, number] {
        if (!movementDirection.isMoving()) {
            return GUN_OFFSETS.idle[movementDirection.getFacingDirection()] as [number, number];
        } else {
            return GUN_OFFSETS.moving[movementDirection.getFacingDirection()] as [number, number];
        }
    }
}