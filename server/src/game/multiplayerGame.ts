import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { config } from "../config.js";
import MainScene from "../scenes/mainScene.js";
import GameObserver from "../../../common/observer/gameObserver.js";
import { GameEvents } from "../types/events.js";
import Observer from "../../../common/observer/observer.js";
import { World } from "../objects/world.js";

export class MultiplayerGame extends Phaser.Game {
  mainScene: MainScene;
  observer: Observer<GameEvents>;
  world: World;

  constructor(gameMaster: GameMaster, onEnd: () => void) {
    super(config);
    let observer = new GameObserver();
    this.observer = observer;
    function createScene() {
      return new MainScene(observer);
    }
    this.mainScene = this.scene.add("MainScene", createScene, true) as MainScene;
    this.world = new World(this.mainScene, this.observer, gameMaster, onEnd);
  }

  public addPlayer(id: string): boolean {
    return this.world.addPlayer(id) || false;
  }
}
