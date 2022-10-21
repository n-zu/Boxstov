import { MultiplayerGame } from "../game/multiplayerGame";
import { Player } from "../objects/player";
import { World, WorldState } from "../objects/world";
import { GameMaster } from "../gameMaster";
import { HostMaster } from "../hostMaster";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default class MainScene extends Phaser.Scene {
  game: MultiplayerGame;
  world: World;
  controlKeys: CursorKeys;
  gameMaster: GameMaster;

  protected constructor() {
    super({ key: "MainScene" });
  }

  public shoot(playerId: string, x: number, y: number) {
    const angle = Phaser.Math.Angle.Between(
      this.world.players.find((p) => p.id == playerId)?.x ?? 0,
      this.world.players.find((p) => p.id == playerId)?.y ?? 0,
      x,
      y
    );
    this.world.spawnBullet(
      this.world.players.find((p) => p.id == playerId)?.x ?? 0,
      this.world.players.find((p) => p.id == playerId)?.y ?? 0,
      angle
    );
  }

  create() {
    // FIXME: Need a way to get the ids
    const id = Math.random().toString(36).substring(7);
    const player = new Player(this, 100, 100, id, this.game.gameMaster);
    this.world = new World(player, this, this.game.gameMaster);

    this.gameMaster = this.game.gameMaster;

    this.controlKeys = this.input.keyboard.createCursorKeys();

    // FIXME: :(
    if (this.gameMaster instanceof HostMaster) {
      setInterval(() => {
        this.gameMaster.send("sync", this.world.getState());
      }, 100);

      this.gameMaster.addAction("newPlayer", (data) => {
        const id = data.id;
        this.world.players.push(
          new Player(this, 100, 100, id, this.game.gameMaster)
        );
      });
    } else {
      this.gameMaster.send("newPlayer", { id: id });
    }
  }

  public getState(): WorldState {
    return this.world.getState();
  }

  public sync(worldState: WorldState) {
    this.world.sync(worldState);
  }

  update() {
    // FIXME
    this.world.players[0].update(this.controlKeys);
  }

  preload() {
    this.load.image("player", "assets/bunny.png");
    this.load.image("bullet", "assets/bullet.png");
  }

  public movePlayerUp(id: string) {
    this.world.movePlayerUp(id);
  }

  public movePlayerDown(id: string) {
    this.world.movePlayerDown(id);
  }

  public movePlayerLeft(id: string) {
    this.world.movePlayerLeft(id);
  }

  public movePlayerRight(id: string) {
    this.world.movePlayerRight(id);
  }
}
