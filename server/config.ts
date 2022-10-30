import "@geckos.io/phaser-on-nodejs"
import Phaser from 'phaser'

import GameConfig = Phaser.Types.Core.GameConfig;
import MainScene from "./scenes/mainScene";

export const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-game',
  width: 896,
  height: 504,
  banner: false,
  audio: false,
  scene: [MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1200 }
    }
  }
} as GameConfig
