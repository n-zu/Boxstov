import { Player } from "../objects/player";
import { HealthBar } from "../ui/healthBar";

export class UIScene extends Phaser.Scene {
  player: Player;
  healthBar: HealthBar;

  constructor() {
    super({ key: "UIScene" });
  }

  create(player: Player) {
    this.scene.bringToTop("UIScene");
    this.player = player;

    this.healthBar = new HealthBar(this, 10, 10, this.player.maxHealth);
  }

  update() {
    this.healthBar.setHealth(this.player.health);
  }
}