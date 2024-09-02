
import MovementDirection from "../../../common/controls/direction";

import { GunName, Guns } from "../../../common/guns.js";
import { KILLS_TO_UNLOCK } from "../../../common/constants.js";
import Observer from "../../../common/observer/observer";
import { PlayerRecentEvent } from "../../../common/types/state";
import { GameEvents } from "../types/events";

export default class PlayerArsenal {
    playerId: string;
    kills: number;
    currentGun: GunName;
    recentEvents: PlayerRecentEvent[];
    observer: Observer<GameEvents>;

    constructor(playerId: string, observer: Observer<GameEvents>) {
        this.playerId = playerId;
        this.kills = 0;
        this.currentGun = GunName.Rifle;
        this.recentEvents = [];
        this.observer = observer;
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        this.observer.subscribe("enemyKilled", (killerId: string) => {
            if (this.playerId === killerId) {
              this.kills++;
              this.recentEvents.push("kill");
              for (const gunName of Object.keys(Guns)) {
                if (this.kills === KILLS_TO_UNLOCK[gunName as GunName]) {
                  this.recentEvents.push("unlocked_gun");
                }
              }
            }
          });
    }

    private has(gunName: GunName): boolean {
        return this.kills >= KILLS_TO_UNLOCK[gunName];
    }

    public shoot(playerX: number, playerY: number, movementDirection: MovementDirection) {
      const gun = Guns[this.currentGun];
      const rotation = gun.getGunRotation(movementDirection);
      const [xGun, yGun] = gun.getGunOffset(movementDirection);
  
      this.observer.notify("shootBullet", {
        x: playerX + xGun,
        y: playerY + yGun,
        rotation,
        gunName: this.currentGun,
        playerId: this.playerId
      });
      this.recentEvents.push("shoot");
    }

    public switchGun(gunName: GunName) {
        if (this.has(gunName)) {
            this.currentGun = gunName;
        }
    }

    public clearEvents() {
        this.recentEvents = [];
    }
}