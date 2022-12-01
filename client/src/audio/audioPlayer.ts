import { GameEvents } from "../types/events";
import Observer from "../../../common/observer/observer.js";
import { GunName } from "../../../common/guns.js";
import { Player } from "../objects/player";

export default class AudioPlayer {
  scene: Phaser.Scene;
  observer: Observer<GameEvents>;

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
  }

  private playPlayerReceivedDamageSound(player: Player) {
    this.scene.sound.play("player_received_damage", {
      volume: this.calculatePlayerSoundVolume(player)
    });
  }

  private playUnlockGunSound(player: Player) {
    this.scene.sound.play("unlocked_gun", {
      volume: this.calculatePlayerSoundVolume(player)
    });
  }

  private playSwitchGunSound(player: Player) {
    this.scene.sound.play("switch_gun", {
      volume: this.calculatePlayerSoundVolume(player)
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
    const soundVolume = this.calculatePlayerSoundVolume(player);
    switch (player.gunName) {
      case GunName.Rifle:
        this.scene.sound.play("rifle", { volume: soundVolume });
        break;
      case GunName.Shotgun:
        this.scene.sound.play("shotgun", { volume: soundVolume });
        break;
      case GunName.Rpg:
        this.scene.sound.play("rpg", { volume: soundVolume });
        break;
    }
  }

  private calculateSoundVolume(distanceToCamera: number, maxDistance: number) {
    return 1 - distanceToCamera / maxDistance;
  }
}