import { Player } from "../objects/player";

class HealthBar {
  bar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.bar.setDepth(9999);

    scene.add.existing(this.bar);
  }

  draw(player: Player) {
    this.bar.clear();

    const x = player.x - 60;
    const y = player.y - 180;
    const height = 12;
    const width = player.health;
    const maxWidth = player.maxHealth;

    //  BG
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(x, y, maxWidth + 4, height + 4);

    //  Health
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(x + 2, y + 2, maxWidth, height);

    if (width < maxWidth / 5) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }

    this.bar.fillRect(x + 2, y + 2, width, height);
  }
}

class Points {
  points: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.points = scene.add.text(0, 0, "Hello World", {
      fontFamily: '"Roboto Condensed"',
      fontSize: "50px",
    });

    this.points.setDepth(9999);
  }

  sync(points: number) {
    this.points.setText(`Points: ${points.toFixed(2)}`);
  }

  update(x: number, y: number) {
    this.points.setPosition(x, y);
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
  points: Points;
  over = false;

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene;
    this.player = player;
    this.healthBar = new HealthBar(scene);
    this.points = new Points(scene);
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

    const cx = 0;
    const cy = 0;
    this.points.update(cx, cy);
  }

  public sync(points: number) {
    this.points.sync(points);
  }
}
