import { MultiplayerGame } from "../game/multiplayerGame.js";
import { World, WorldState } from "../objects/world.js";
import { GameMaster } from "../gameMaster/gameMaster.js";

export default class MainScene extends Phaser.Scene {
  // @ts-ignore
  game: MultiplayerGame;
  // @ts-ignore
  world: World;
  // @ts-ignore
  gameMaster: GameMaster;

  protected constructor() {
    super({ key: "MainScene" });
  }

  create() {
    this.world = new World(this, this.game.gameMaster);
    this.gameMaster = this.game.gameMaster;
  }

  public sync(worldState: WorldState) {
    this.world.sync(worldState);
  }

  update() {
    this.world.update();
    this.gameMaster.broadcast("sync", this.world.getState());
  }
}
