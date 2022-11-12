import { Player } from "./player.js";
import { BulletGroup } from "../groups/bulletGroup.js";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { Enemy } from "./enemy.js";
import { Bullet } from "./bullet.js";
import { Difficulty, EnemyGroup } from "../groups/enemyGroup.js";
import { WorldState } from "../../../common/types/state.js";
import { EnemyUpdate, PlayerUpdate } from "../../../common/types/messages.js";

export class World {
  players: Player[];
  // @ts-ignore
  enemies: EnemyGroup;
  bulletGroup: BulletGroup;
  gameMaster: GameMaster;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gameMaster: GameMaster) {
    this.players = [];
    this.bulletGroup = new BulletGroup(scene);
    this.gameMaster = gameMaster;
    this.scene = scene;
  }

  public create() {
    const spawnPoints = [
      { x: 100, y: 100 },
      { x: 100, y: 900 },
      { x: 1800, y: 100 },
      { x: 1800, y: 900 },
    ];

    this.enemies = new EnemyGroup(
      this.scene,
      5,
      Difficulty.Hard,
      spawnPoints,
      this.gameMaster
    );

    this.scene.physics.add.overlap(this.enemies, this.bulletGroup, (e, b) => {
      const bullet = b as Bullet;
      const enemy = e as Enemy;
      if (bullet.active && enemy.active) {
        bullet.collideWith(enemy);
      }
    });

    // Enemies repel each other
    this.scene.physics.add.collider(this.enemies, this.enemies);
    this.setupGameMaster(this.gameMaster);
  }

  public update() {
    // TODO: 5000ms is a magic number
    const isActive = (p: Player) => Date.now() - 5000 < p.lastUpdate;
    this.players = this.players.filter(isActive);
    this.enemies.update(this.players);
  }

  public getState(): WorldState {
    return {
      players: this.players.map((player) => player.getState()),
      bullets: this.bulletGroup.getState(),
      enemies: this.enemies.getState(),
    };
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
    gameMaster.addAction("player", (data: PlayerUpdate) => {
      const player = this.getOrCreatePlayer(data.id);
      player.handleMessage(data.payload);
    });

    gameMaster.addAction("enemy", (data: EnemyUpdate) => {
      this.enemies.handleMessage(data);
    });
  }
}
