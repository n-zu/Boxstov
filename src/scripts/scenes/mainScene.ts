import { World, WorldState } from "../objects/world";
import { Player } from "../objects/player";
import { MultiplayerGame } from "../game/multiplayerGame";

export default class MainScene extends Phaser.Scene {
  world: World;
  game: MultiplayerGame;

  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    const host = new Player(this, 100, 100);
    const guest = new Player(this, 200, 100);
    this.world = new World([host, guest]);
  }

  update() {
    this.world.update(this.game.getPlayerId());
  }

  public getWorldState(): WorldState {
    return this.world.getState();
  }

  preload() {
    this.load.image("player", "assets/bunny.png");
  }
}
