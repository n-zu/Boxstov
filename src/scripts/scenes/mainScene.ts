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

  public stop(playerId: string) {
    this.world.stop(playerId);
  }

  create() {
    // FIXME: Need a way to get the ids
    const player = new Player(this, 100, 100, "_me");
    this.world = new World([player], this);

    this.gameMaster = new GameMaster(
      this,
      this.game.socketId,
      this.game.idToConnect
    );

    this.controlKeys = this.input.keyboard.createCursorKeys();
    this.input.on("pointerdown", (pointer: Pointer) => {
      this.world.shoot(this.game.playerId ?? "_me", pointer.x, pointer.y);
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
    this.world.updatePlayerPosition(
      this.game.playerId ?? "_me",
      this.controlKeys
    );
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
