import { GameEvents } from "../types/events";
import Observer from "../../../common/observer/observer.js";
import { Player } from "../objects/player";
import { Enemy } from "../objects/enemy";

const MAX_ATTACK_SOUND_AMOUNT = 3;
const MAX_DMG_SOUND_AMOUNT = 5;
const MIN_VOLUME = 0.01;

export default class AudioPlayer {
  scene: Phaser.Scene;
  observer: Observer<GameEvents>;
  attackSoundsAmount = 0;
  dmgSoundsAmount = 0;

  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>) {
    this.scene = scene;
    this.observer = observer;

    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    this.observer.subscribe("playerShoot", (player) => this.playShootSound(player));
    this.observer.subscribe("playerSwitchedGun", (player) => this.playSwitchGunSound(player));
    this.observer.subscribe("playerUnlockedGun", (player) => this.playUnlockGunSound(player));
    this.observer.subscribe("playerReceivedDamage", (player) => this.playPlayerReceivedDamageSound(player));
    this.observer.subscribe("enemyReceivedDamage", (enemy) => this.playEnemyReceivedDamageSound(enemy));
  }

  private playEnemyReceivedDamageSound(enemy: Enemy) {
    const volume = this.calculateEnemySoundVolume(enemy);
    if (volume < MIN_VOLUME) return;

    if (this.dmgSoundsAmount < MAX_ATTACK_SOUND_AMOUNT) {
      this.dmgSoundsAmount++;
      console.log("play dmg sound");
      this.scene.sound.add("bullet_hit", {
        volume
      }).once("complete", () => {
        this.dmgSoundsAmount--;
      }).play();
    }
  }

  private calculateEnemySoundVolume(enemy: Enemy): number {
    const distanceToCamera = enemy.getDistanceToCamera();
    const maxDistance = enemy.getMaxDistanceToCamera();
    return this.calculateSoundVolume(
      distanceToCamera,
      maxDistance
    );
  }

  private playPlayerReceivedDamageSound(player: Player) {
    const volume = this.calculatePlayerSoundVolume(player);
    if (volume < MIN_VOLUME) return;

    if (this.attackSoundsAmount < MAX_DMG_SOUND_AMOUNT) {
      this.attackSoundsAmount++;
      this.scene.sound.add("player_receive_damage", {
        volume
      }).once("complete", () => {
        this.attackSoundsAmount--;
      }).play();
    }
  }

  private playUnlockGunSound(player: Player) {
    const volume = this.calculatePlayerSoundVolume(player);
    if (volume < MIN_VOLUME) return;

    this.scene.sound.play("unlocked_gun", {
      volume
    });
  }

  private playSwitchGunSound(player: Player) {
    const volume = this.calculatePlayerSoundVolume(player);
    if (volume < MIN_VOLUME) return;
    this.scene.sound.play("switch_gun", {
      volume
    });
  }

  private calculatePlayerSoundVolume(player: Player): number {
    const distanceToCamera = player.getDistanceToCamera();
    const maxDistance = player.getMaxDistanceToCamera();
    return this.calculateSoundVolume(
      distanceToCamera,
      maxDistance
    );
  }

  private playShootSound(player: Player) {
    const volume = this.calculatePlayerSoundVolume(player);
    if (volume < MIN_VOLUME) return;

    switch (player.arsenal.currentGun.getGunName()) {
      case "rifle":
        this.scene.sound.play("rifle", { volume });
        break;
      case "shotgun":
        this.scene.sound.play("shotgun", { volume });
        break;
      case "rpg":
        this.scene.sound.play("rpg", { volume });
        break;
    }
  }

  private calculateSoundVolume(distanceToCamera: number, maxDistance: number) {
    return 1 - distanceToCamera / maxDistance;
  }
}