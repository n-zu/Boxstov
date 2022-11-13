import { MultiplayerGame } from "./game/multiplayerGame";
import { GuestMaster } from "./gameMaster/guestMaster";
import Loader from "./scenes/load";

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

const gameConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#ffffff",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [Loader],
  antialias: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  transparent: true,
};

window.addEventListener("load", () => {
  const gameMaster = new GuestMaster();
  new MultiplayerGame(gameConfig, gameMaster);
});
