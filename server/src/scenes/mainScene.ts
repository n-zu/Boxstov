import { World } from "../objects/world.js";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { MS_BETWEEN_SYNCS, WORLD_BOUNDS } from "../../../common/constants.js";
import GameObserver from "../../../common/observer/gameObserver.js";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events.js";

type MainSceneData = {
  gameMaster: GameMaster;
  onEnd: () => void;
};

export default class MainScene extends Phaser.Scene {
  world!: World;
  gameMaster?: GameMaster;
  onEnd?: () => void;
  observer: Observer<GameEvents>;
  lastSyncTimestamp = 0;

  protected constructor() {
    super({ key: "MainScene" });
    this.observer = new GameObserver();
  }

  create({ gameMaster, onEnd }: MainSceneData) {
    this.gameMaster = gameMaster;
    this.world = new World(this, this.observer, gameMaster, onEnd);
    this.world.create();
    this.physics.world.setBounds(...WORLD_BOUNDS)
  }

  update() {
    this.world.update();
    if (Date.now() - this.lastSyncTimestamp > MS_BETWEEN_SYNCS) {
      this.gameMaster?.broadcast("sync", this.world.getState());
      this.lastSyncTimestamp = Date.now();
    }
  }

  public addPlayer(id: string): boolean {
    return this.world?.addPlayer(id);
  }
}
