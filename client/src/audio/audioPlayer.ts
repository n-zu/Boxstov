import { GameEvents } from "../types/events";
import Observer from "../../../common/observer/observer.js";
import { GunName } from "../../../common/guns.js";
import { Player } from "../objects/player";

const MAX_ATTACK_SOUND_AMOUNT = 3;
const MIN_VOLUME = 0.01;

export default class AudioPlayer {
  scene: Phaser.Scene;
  observer: Observer<GameEvents>;
  attackSoundsAmount = 0;

  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>) {
    this.scene = scene;
    this.observer = observer;

    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    this.observer.subscribe("playerShoot", (player) => this.playShootSound(player));
    this.observer.subscribe("playerSwitchedGun", (player) => this.playSwitchGunSound(player));
    this.observer.subscribe("playerUnlockedGun", (player) => this.playUnlockGunSound(player));
    this.observer.subscribe("playerReceiveDamage", (player) => this.playPlayerReceivedDamageSound(player));
  }

  private playPlayerReceivedDamageSound(player: Player) {
    const volume = this.calculatePlayerSoundVolume(player);
    if (volume < MIN_VOLUME) return;

    if (this.attackSoundsAmount < MAX_ATTACK_SOUND_AMOUNT) {
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

    switch (player.gunName) {
      case GunName.Rifle:
        this.scene.sound.play("rifle", { volume });
        break;
      case GunName.Shotgun:
        this.scene.sound.play("shotgun", { volume });
        break;
      case GunName.Rpg:
        this.scene.sound.play("rpg", { volume });
        break;
    }
  }

  private calculateSoundVolume(distanceToCamera: number, maxDistance: number) {
    return 1 - distanceToCamera / maxDistance;
  }
}