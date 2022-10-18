import PhaserLogo from "../objects/phaserLogo";
import FpsText from "../objects/fpsText";

type ExtendedGameType = Phaser.Game & {
  network_mode: "host" | "guest";
};

export default class MainScene extends Phaser.Scene {
  fpsText;

  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    new PhaserLogo(this, this.cameras.main.width / 2, 0);
    this.fpsText = new FpsText(this);

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: "#000000",
        fontSize: "24px",
      })
      .setOrigin(1, 0);

    const game = this.game as ExtendedGameType;
    console.log("I am the", game.network_mode);
  }

  update() {
    this.fpsText.update();
  }
}
