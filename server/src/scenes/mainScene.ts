import { MultiplayerGame } from "../game/multiplayerGame.js";
import { World } from "../objects/world.js";
import { GameMaster } from "../gameMaster/gameMaster.js";

type MainSceneData = {
  gameMaster: GameMaster;
  onEnd: () => void;
};

export default class MainScene extends Phaser.Scene {
  world!: World;
  gameMaster?: GameMaster;
  onEnd?: () => void;

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
    this.gameMaster?.broadcast("sync", this.world.getState());
  }
}
