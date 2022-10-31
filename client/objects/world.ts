import { Player, PlayerState } from "./player";
import { BulletGroup, BulletGroupState } from "../groups/bulletGroup";
import { GameMaster } from "../gameMaster/gameMaster";
import { PlayerControls } from "../controls/playerControls";
import { Enemy } from "./enemy";
import { Bullet } from "./bullet";
import { Difficulty, EnemyGroup, EnemyGroupState } from "../groups/enemyGroup";

export type WorldState = {
  players: PlayerState[];
  bullets: BulletGroupState;
  enemies: EnemyGroupState;
};

export class World {
  // @ts-ignore
  players: Player[];
  enemies: EnemyGroup;
  // @ts-ignore
  playerControls: PlayerControls;
  // @ts-ignore
  bulletGroup: BulletGroup;
  gameMaster: GameMaster;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gameMaster: GameMaster) {
    this.gameMaster = gameMaster;
    this.scene = scene;
    this.enemies = new EnemyGroup(scene, 50);

    this.setupGameMaster(gameMaster);
    console.log("setting up first player");
    this.setupFirstPlayer(scene, gameMaster);
    console.log("done constructing world");
  }

  public update() {
    this.playerControls.update();
  }

  public sync(worldState: WorldState) {
    worldState.players.forEach((playerState) => {
      const player = this.getOrCreatePlayer(playerState.id);
      player.sync(playerState);
    });
    this.enemies.sync(worldState.enemies);

    this.bulletGroup.sync(worldState.bullets);
  }

  private setupFirstPlayer(scene: Phaser.Scene, gameMaster: GameMaster) {
    console.log(scene);
    this.bulletGroup = new BulletGroup(scene);

    const playerId = Math.random().toString(36).substring(7);
    const player = new Player(
      scene,
      800,
      500,
      playerId,
      gameMaster,
      this.bulletGroup
    );
    this.playerControls = new PlayerControls(player);

    this.players = [player];

    scene.cameras.main.startFollow(player);

    // @ts-ignore
    scene.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      scene.cameras.main.zoom -= deltaY * 0.001;
    });
  }

  private getOrCreatePlayer(id: string): Player {
    let player = this.players.find((p) => p.id === id);
    if (player === undefined) {
      player = new Player(
        this.scene,
        800,
        500,
        id,
        this.gameMaster,
        this.bulletGroup
      );
      this.players.push(player);
    }
    return player;
  }

  private setupGameMaster(gameMaster: GameMaster) {
    console.log("setting up game master");
    gameMaster.addAction("player", (data: any) => {
      const player = this.getOrCreatePlayer(data.id);
      player.handleMessage(data.payload);
    });

    gameMaster.addAction("sync", (data: any) => {
      this.sync(data);
    });

    gameMaster.addAction("enemy", (data: any) => {
      this.enemies.handleMessage(data);
    });
    console.log("done setting up game master");
  }
}
