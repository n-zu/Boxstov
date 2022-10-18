import "phaser";
import MainScene from "./scenes/mainScene";
import PreloadScene from "./scenes/preloadScene";

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#ffffff",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 400 },
    },
  },
};

window.addEventListener("load", () => {
  const hostBtn = document.getElementById("host-btn") as HTMLButtonElement;
  const guestBtn = document.getElementById("guest-btn") as HTMLButtonElement;

  hostBtn.addEventListener("click", () => {
    hostBtn.disabled = true;
    guestBtn.disabled = true;

    const game = new Phaser.Game(config);
    //@ts-ignore
    game.network_mode = "host";
  });
  guestBtn.addEventListener("click", () => {
    hostBtn.disabled = true;
    guestBtn.disabled = true;

    const game = new Phaser.Game(config);
    //@ts-ignore
    game.network_mode = "guest";
  });
});
