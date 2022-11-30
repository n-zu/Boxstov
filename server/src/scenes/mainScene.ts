import { World } from "../objects/world.js";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { MS_BETWEEN_SYNCS } from "../../../common/constants.js";

type MainSceneData = {
  gameMaster: GameMaster;
  onEnd: () => void;
};

export default class MainScene extends Phaser.Scene {
  world!: World;
  gameMaster?: GameMaster;
  onEnd?: () => void;
  lastSyncTimestamp = 0;

  protected constructor() {
    super({ key: "MainScene" });
  }

  create({ gameMaster, onEnd }: MainSceneData) {
    this.gameMaster = gameMaster;
    this.world = new World(this, gameMaster, onEnd);
    this.world.create();
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
