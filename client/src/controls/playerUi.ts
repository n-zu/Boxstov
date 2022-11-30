const Y_OFFSET_BAR = 60;
const Y_OFFSET_TEXT = 40;
const BAR_HEIGHT = 12;
const BAR_PADDING = 2;
const TAG_DEPTH_BASE = 10000;

const NAMETAG_STYLE = {
  align: "center",
  font: "bold 20px monospace"
};

class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  name: Phaser.GameObjects.Text;
  username: string;

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
    this.username = username;
  }

  draw(xPos: number, yPos: number, height: number, health: number, maxHealth: number) {
    this.bar.clear();
    const x = xPos;
    const y = yPos - height / 2;

    const barX = x - maxHealth / 2 - BAR_PADDING;
    const barY = y + Y_OFFSET_BAR;

    const width = health;
    const maxWidth = maxHealth;
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

export class PlayerUI {
  scene: Phaser.Scene;
  healthBar: HealthBar;
  username: string;

  constructor(scene: Phaser.Scene, playerId: string) {
    this.scene = scene;
    this.healthBar = new HealthBar(scene, playerId);
    this.username = playerId;
  }

  public update(x: number, y: number, height: number, health: number, maxHealth: number) {
    this.healthBar.draw(x, y, height, health, maxHealth);
  }
}
