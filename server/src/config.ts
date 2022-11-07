import "@geckos.io/phaser-on-nodejs";

import Phaser from "phaser";
import MainScene from "./scenes/mainScene.js";
import GameConfig = Phaser.Types.Core.GameConfig;

export const config = {
  type: Phaser.HEADLESS,
  parent: "phaser-game",
  width: 896,
  height: 504,
  banner: false,
  audio: false,
  scene: [MainScene],
  physics: {
    default: "arcade",
  },
} as GameConfig;
