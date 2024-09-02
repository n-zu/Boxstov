import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { phaserGameConfig } from "../phaserGameConfig.js";
import MainScene from "../scenes/mainScene.js";
import { GameEvents } from "../types/events.js";
import Observer from "../../../common/observer/observer.js";
import { World } from "../objects/world.js";
import { MS_BETWEEN_SYNCS } from "../../../common/constants.js";
import { PlayerUpdate } from "../../../common/types/messages.js";

export class MultiplayerGame extends Phaser.Game {
  mainScene: MainScene;
  observer: Observer<GameEvents>;
  world: World;

  gameMaster: GameMaster;
  lastSyncTimestamp = 0;

  constructor(gameMaster: GameMaster, observer: Observer<GameEvents>) {
    super(phaserGameConfig);
    this.gameMaster = gameMaster;
    this.setupGameMaster(gameMaster);

    this.observer = observer;
    function createScene() {
      return new MainScene(observer);
    }
    this.mainScene = this.scene.add("MainScene", createScene, true) as MainScene;
    this.world = new World(this.mainScene, this.observer);

    this.observer.subscribe("tick", () => this.sync());
  }

  public addPlayer(id: string): boolean {
    return this.world.addPlayer(id) || false;
  }

  private sync() {
    if (Date.now() - this.lastSyncTimestamp > MS_BETWEEN_SYNCS) {
      this.gameMaster.broadcast("sync", this.world.getState());
      this.lastSyncTimestamp = Date.now();
    }
  }

  private setupGameMaster(gameMaster: GameMaster) {
    gameMaster.addAction("player", (data: PlayerUpdate) => {
      this.world.updatePlayer(data);
    });
  }
}
