import { Player, PlayerState } from "./player";
import { BulletGroup, BulletGroupState } from "./bulletGroup";
import { GameMaster } from "../gameMaster";
import { PlayerControls } from "./playerControls";

export type WorldState = {
  players: PlayerState[];
  bullets: BulletGroupState;
};

export class World {
  players: Player[];
  playerControls: PlayerControls;
  bulletGroup: BulletGroup;
  gameMaster: GameMaster;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gameMaster: GameMaster) {
    this.setupFirstPlayer(scene, gameMaster);

    this.gameMaster = gameMaster;
    this.scene = scene;

    this.setupGameMaster(gameMaster);
  }

  public update() {
    this.playerControls.update();
  }

  public sync(worldState: WorldState) {
    worldState.players.forEach((playerState) => {
      const player = this.getOrCreatePlayer(playerState.id);
      player.sync(playerState);
    });

    this.bulletGroup.sync(worldState.bullets);
  }

  public getState(): WorldState {
    return {
      players: this.players.map((player) => player.getState()),
      bullets: this.bulletGroup.getState(),
    };
  }

  private setupFirstPlayer(scene: Phaser.Scene, gameMaster: GameMaster) {
    this.bulletGroup = new BulletGroup(scene);

    const playerId = Math.random().toString(36).substring(7);
    const player = new Player(
      scene,
      100,
      100,
      playerId,
      gameMaster,
      this.bulletGroup
    );
    this.playerControls = new PlayerControls(player);

    this.players = [player];

    scene.input.on("pointerdown", (pointer) => {
      player.shoot(pointer.x, pointer.y);
    });
  }

  private getOrCreatePlayer(id: string): Player {
    let player = this.players.find((p) => p.id === id);
    if (player === undefined) {
      player = new Player(
        this.scene,
        100,
        100,
        id,
        this.gameMaster,
        this.bulletGroup
      );
      this.players.push(player);
    }
    return player;
  }

  private setupGameMaster(gameMaster: GameMaster) {
    gameMaster.addAction("move", (data: any) => {
      this.getOrCreatePlayer(data.id).move(data.direction);
    });

    gameMaster.addAction("shoot", (data: any) => {
      this.getOrCreatePlayer(data.id).shoot(data.x, data.y, false);
    });

    gameMaster.addAction("stop", (data: any) => {
      this.getOrCreatePlayer(data.id).stopMovement(false);
    });

    gameMaster.addAction("sync", (data: any) => {
      this.sync(data);
    });
  }
}
