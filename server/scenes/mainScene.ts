import { World, WorldState } from "../objects/world";
import { GameMaster } from "../gameMaster/gameMaster";
import { Direction } from "../objects/player";
import Sprite = Phaser.Physics.Arcade.Sprite;
import {MultiplayerGame} from "../game";

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

  preload() {
    this.game = this.game as MultiplayerGame;
    this.gameMaster = this.game.gameMaster;
    this.world = new World(this, this.game.gameMaster);
  }

  public getState(): WorldState {
    return this.world.getState();
  }

  public sync(worldState: WorldState) {
    this.world.sync(worldState);
  }

  update() {
    if (this.gameMaster.shouldSendSync()) {
      this.world.update();
      this.gameMaster.send("sync", this.world.getState());
    } else {
      this.world.playerControls.update();
    }
  }
}
