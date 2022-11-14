import { Player } from "../objects/player";

const Y_OFFSET_BAR = 60;
const Y_OFFSET_TEXT = 40;
const BAR_HEIGHT = 12;
const BAR_PADDING = 2;
const TAG_DEPTH_BASE = 10000;

const NAMETAG_STYLE = {
  align: "center",
  font: "bold 20px monospace",
};

class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  name: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, username: string) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.bar.setDepth(9999);
    this.name = new Phaser.GameObjects.Text(
      scene,
      0,
      0,
      username,
      NAMETAG_STYLE
    ).setOrigin(0.5);

    scene.add.existing(this.bar);
    scene.add.existing(this.name);
  }

  draw(player: Player) {
    this.bar.clear();
    const x = player.x;
    const y = player.y - player.height / 2;

    const barX = x - player.maxHealth / 2 - BAR_PADDING;
    const barY = y + Y_OFFSET_BAR;

    const width = player.health;
    const maxWidth = player.maxHealth;
    const pad = BAR_PADDING;

    //  BG
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(barX, barY, maxWidth + pad * 2, BAR_HEIGHT + pad * 2);

    //  Health
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(barX + pad, barY + pad, maxWidth, BAR_HEIGHT);

    if (width < maxWidth / 5) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }
    this.bar.fillRect(barX + pad, barY + pad, width, BAR_HEIGHT);

    this.name.setPosition(x, y + Y_OFFSET_TEXT);
    this.name.setDepth(TAG_DEPTH_BASE + y);
  }
}

const motivationalMessages = [
  "GIT GUD",
  "You've been killed to death",
  "💀💀💀",
];

export class PlayerUI {
  scene: Phaser.Scene;
  player: Player;
  healthBar: HealthBar;
  over = false;

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene;
    this.player = player;
    this.healthBar = new HealthBar(scene, player.id);
  }

  public update() {
    // TODO: player death
    // - Where should player death & other main player logic go?
    // - What should happen on death ? -> reloads page rn
    // - Should the player be responsible for its own death? <- sugerencia de copilot :)
    const { health, x, y } = this.player;
    const camera = this.scene.cameras.main;
    if (health <= 0 && !this.over) {
      this.over = true;
      alert(
        motivationalMessages[
          Math.floor(Math.random() * motivationalMessages.length)
        ]
      );
      window.location.reload();
    }
    this.healthBar.draw(this.player);
  }
}
