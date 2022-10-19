import { World, WorldState } from "../objects/world";
import { Player } from "../objects/player";
import { MultiplayerGame } from "../game/multiplayerGame";
import { BulletGroup } from "../objects/bulletGroup";

export default class MainScene extends Phaser.Scene {
  world: World;
  game: MultiplayerGame;
  bulletGroup: BulletGroup;

  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    const host = new Player(this, 100, 100);
    const guest = new Player(this, 200, 100);
    this.world = new World([host, guest]);
    this.bulletGroup = new BulletGroup(this);
    this.input.on("pointerdown", (pointer) => {
      this.world.shoot(this.game.getPlayerId(), pointer.x, pointer.y, this);
    });
  }

  update() {
    this.world.update(this.game.getPlayerId());
  }

  public getWorldState(): WorldState {
    return this.world.getState();
  }

  preload() {
    this.load.image("player", "assets/bunny.png");
    this.load.image("bullet", "assets/bullet.png");
  }
}
