
import MovementDirection from "../../../common/controls/direction.js";

import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events";
import { BulletGroup } from "../groups/bulletGroup";
import { GUN_OFFSETS, GUN_ROTATIONS } from "../../../common/guns/constants.js";
import Gun, { GunName } from "../../../common/guns/gun.js";
import Rifle from "../../../common/guns/rifle.js";
import Shotgun from "../../../common/guns/shotgun.js";
import Rpg from "../../../common/guns/rpg.js";

export default class PlayerArsenal {
    playerId: string;
    kills: number;
    currentGun: Gun;
    guns: Gun[];
    bullets: BulletGroup;
    observer: Observer<GameEvents>;

    constructor(playerId: string, bullets: BulletGroup, observer: Observer<GameEvents>, availableGuns?: Gun[]) {
        this.playerId = playerId;
        this.kills = 0;
        this.bullets = bullets;
        this.guns = availableGuns || [new Rifle(bullets), new Shotgun(bullets), new Rpg(bullets)];
        this.currentGun = this.guns[0];
        this.observer = observer;
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        this.observer.subscribe("enemyKilled", (killerId: string) => {
            if (this.playerId === killerId) {
              this.kills++;
              for (let gun of this.guns) {
                if (gun.getKillsToUnlock() == this.kills) {
                  this.observer.notify("unlockedGun", this.playerId);
                }
              }
            }
          });
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
        for (const gun of this.guns) {
            if (gun.getGunName() === gunName) {
                if (gun.getKillsToUnlock() <= this.kills) {
                    this.currentGun = gun;
                }
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