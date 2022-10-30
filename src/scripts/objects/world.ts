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
  players: Player[];
  enemies: EnemyGroup;
  playerControls: PlayerControls;
  bulletGroup: BulletGroup;
  gameMaster: GameMaster;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gameMaster: GameMaster) {
    this.setupFirstPlayer(scene, gameMaster);

    this.gameMaster = gameMaster;
    this.scene = scene;

    this.setupGameMaster(gameMaster);

    const spawnPoints = [
      { x: 100, y: 100 },
      { x: 100, y: 900 },
      { x: 1800, y: 100 },
      { x: 1800, y: 900 }
    ];

    this.enemies = new EnemyGroup(scene, 50, Difficulty.Hard, spawnPoints, gameMaster);

    scene.physics.add.overlap(this.enemies, this.bulletGroup, (e, b) => {
      const bullet = b as Bullet;
      const enemy = e as Enemy;
      if (bullet.active && enemy.active) {
        bullet.collideWith(enemy);
      }
    });

    // Enemies repel each other
    scene.physics.add.collider(this.enemies, this.enemies);
  }

  public update() {
    this.playerControls.update();
    this.enemies.update(this.players);
  }

  public sync(worldState: WorldState) {
    worldState.players.forEach((playerState) => {
      const player = this.getOrCreatePlayer(playerState.id);
      player.sync(playerState);
    });
    this.enemies.sync(worldState.enemies);

    this.bulletGroup.sync(worldState.bullets);
  }

  public getState(): WorldState {
    return {
      players: this.players.map((player) => player.getState()),
      bullets: this.bulletGroup.getState(),
      enemies: this.enemies.getState()
    };
  }

  private setupFirstPlayer(scene: Phaser.Scene, gameMaster: GameMaster) {
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
      this.gameMaster.send("sync", this.getState());
    }
    return player;
  }

  private setupGameMaster(gameMaster: GameMaster) {
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
  }
}
