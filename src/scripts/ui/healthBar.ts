const BAR_WIDTH = 200;
const BAR_HEIGHT = 16;
const BAR_OFFSET = 2;

const BAR_NORMAL_COLOR = 0x00ff00;
const BAR_DANGER_COLOR = 0xff0000;
const BAR_BACKGROUND_COLOR = 0x000000;

const BAR_DANGER_THRESHOLD = 0.3;

export class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  value: number;
  maxValue: number;

  constructor(scene: Phaser.Scene, x: number, y: number, maxValue: number) {
    this.x = x;
    this.y = y;
    this.value = maxValue;
    this.maxValue = maxValue;
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.draw();
    scene.add.existing(this.bar);
  }

  setHealth(value: number) {
    this.value = Math.max(0, value);
    this.draw();
  }

  draw() {
    this.bar.clear();

    this.bar.fillStyle(BAR_BACKGROUND_COLOR);
    this.bar.fillRect(this.x, this.y, BAR_WIDTH, BAR_HEIGHT);

    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x + BAR_OFFSET, this.y + BAR_OFFSET, BAR_WIDTH - 2 * BAR_OFFSET, BAR_HEIGHT - 2 * BAR_OFFSET);
    const percent = this.value / this.maxValue;
    if (percent < BAR_DANGER_THRESHOLD) {
      this.bar.fillStyle(BAR_DANGER_COLOR);
    } else {
      this.bar.fillStyle(BAR_NORMAL_COLOR);
    }
    const width = Math.max(0, BAR_WIDTH * percent - 2 * BAR_OFFSET);
    this.bar.fillRect(this.x + BAR_OFFSET, this.y + BAR_OFFSET, width, BAR_HEIGHT - 2 * BAR_OFFSET);
  }
}