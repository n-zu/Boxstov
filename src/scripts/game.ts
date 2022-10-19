import "phaser";
import { HostMainScene } from "./scenes/hostMainScene";
import { GuestMainScene } from "./scenes/guestMainScene";
import { MultiplayerGame } from "./game/multiplayerGame";

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 200;
const host_id = "efoppiano2";

const hostConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#ffffff",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [HostMainScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

const guestConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#ffffff",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [GuestMainScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

window.addEventListener("load", () => {
  const hostBtn = document.getElementById("host-btn") as HTMLButtonElement;
  const guestBtn = document.getElementById("guest-btn") as HTMLButtonElement;

  hostBtn.addEventListener("click", () => {
    hostBtn.disabled = true;
    guestBtn.disabled = true;

    let game = new MultiplayerGame(hostConfig, 0, host_id);
  });
  guestBtn.addEventListener("click", () => {
    hostBtn.disabled = true;
    guestBtn.disabled = true;

    let game = new MultiplayerGame(guestConfig, 1, host_id);
  });
});
