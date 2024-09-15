import { WORLD_BOUNDS } from "../../../common/constants.js";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../../../common/types/events.js";

export default class MainScene extends Phaser.Scene {
  observer: Observer<GameEvents>;

  constructor(observer: Observer<GameEvents>) {
    super({ key: "MainScene" });
    this.observer = observer;
  }

  create() {
    this.physics.world.setBounds(...WORLD_BOUNDS)
  }

  update() {
    this.observer.notify("tick");
  }
}
