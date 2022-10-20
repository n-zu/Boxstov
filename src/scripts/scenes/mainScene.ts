import { MultiplayerGame } from "../game/multiplayerGame";
import { Player } from "../objects/player";
import { World, WorldState } from "../objects/world";
import { GameMaster } from "../gameMaster";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import Pointer = Phaser.Input.Pointer;

export default class MainScene extends Phaser.Scene {
  game: MultiplayerGame;
  world: World;
  controlKeys: CursorKeys;
  gameMaster: GameMaster;

  protected constructor() {
    super({ key: "MainScene" });
  }

  public shoot(playerId: number, x: number, y: number) {
    let angle = Phaser.Math.Angle.Between(
      this.world.players[playerId].x,
      this.world.players[playerId].y,
      x,
      y
    );
    this.world.spawnBullet(
      this.world.players[playerId].x,
      this.world.players[playerId].y,
      angle
    );
  }

  public stop(playerId: number) {
    this.world.stop(playerId);
  }

  create() {
    this.gameMaster = new GameMaster(
      this,
      this.game.socketId,
      this.game.idToConnect
    );

    // FIXME: Need a way to get the ids
    const player = new Player(this, 100, 100, this.game.playerId);
    const anotherPlayer = new Player(
      this,
      100,
      100,
      this.game.playerId === 0 ? 1 : 0
    );
    this.world = new World([player, anotherPlayer], this);
    this.controlKeys = this.input.keyboard.createCursorKeys();
    this.input.on("pointerdown", (pointer: Pointer) => {
      this.world.shoot(this.game.playerId, pointer.x, pointer.y);
    });
  }

  public getState(): WorldState {
    return this.world.getState();
  }

  public sync(worldState: WorldState) {
    this.world.sync(worldState);
  }

  update() {
    this.world.update();
    this.world.updatePlayerPosition(this.game.playerId, this.controlKeys);
  }

  preload() {
    this.load.image("player", "assets/bunny.png");
    this.load.image("bullet", "assets/bullet.png");
  }

  public movePlayerUp(id: number) {
    this.world.movePlayerUp(id);
  }

  public movePlayerDown(id: number) {
    this.world.movePlayerDown(id);
  }

  public movePlayerLeft(id: number) {
    this.world.movePlayerLeft(id);
  }

  public movePlayerRight(id: number) {
    this.world.movePlayerRight(id);
  }
}
