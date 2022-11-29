import { Player } from "./player.js";
import { BulletGroup } from "../groups/bulletGroup.js";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { Enemy } from "./enemy.js";
import { Bullet } from "./bullet.js";
import { Difficulty, EnemyGroup } from "../groups/enemyGroup.js";
import { WorldState } from "../../../common/types/state.js";
import { PlayerUpdate } from "../../../common/types/messages.js";
import { ENEMY_GROUP_MAX } from "../../../common/constants.js";
import { SnapshotInterpolation } from "@geckos.io/snapshot-interpolation";

const INACTIVE_THRESHOLD = 60000; // if 60 seconds pass, the player is considered inactive

export class World {
  players: Player[];
  enemies?: EnemyGroup;
  bulletGroup: BulletGroup;
  gameMaster: GameMaster;
  scene: Phaser.Scene;
  kills = 0;
  killsPerPlayer: Record<string, number> = {};
  rage = 0.0;
  onEnd: () => void;
  playersSI: SnapshotInterpolation;

  constructor(scene: Phaser.Scene, gameMaster: GameMaster, onEnd: () => void) {
    this.players = [];
    this.bulletGroup = new BulletGroup(scene);
    this.gameMaster = gameMaster;
    this.scene = scene;
    this.onEnd = onEnd;
    this.playersSI = new SnapshotInterpolation(60);
  }

  public create() {
    const spawnPoints = [
      { x: 100, y: 100 },
      { x: 100, y: 900 },
      { x: 1800, y: 100 },
      { x: 1800, y: 900 }
    ];

    this.enemies = new EnemyGroup(
      this.scene,
      ENEMY_GROUP_MAX,
      Difficulty.Hard,
      spawnPoints,
      this.gameMaster,
      this.onEnemyKilled.bind(this)
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
    const isActive = (p: Player) =>
      Date.now() - INACTIVE_THRESHOLD < p.lastUpdate;
    this.players = this.players.filter(isActive);
    if (!this.players.length) this.onEnd();
    this.enemies?.update(this.players);
    this.rage = Math.max(0, this.rage - 0.002);
  }

  public getState(): WorldState {
    return {
      players: this.players.map((player) => player.getState()),
      bullets: this.bulletGroup.getState(),
      rage: this.rage,
      kills: this.kills,
      killsPerPlayer: this.killsPerPlayer,
      enemies: this.enemies!.getState()
    };
  }

  // Returns false if that id is already taken
  public addPlayer(id: string): boolean {
    if (this.players.some((p) => p.id === id)) return false;
    const player = new Player(
      this.scene,
      800,
      500,
      id,
      this.gameMaster,
      this.bulletGroup
    );
    this.players.push(player);
    return true;
  }

  private getPlayer(id: string): Player | undefined {
    return this.players.find((p) => p.id === id);
  }

  private setupGameMaster(gameMaster: GameMaster) {
    gameMaster.addAction("player", (data: PlayerUpdate) => {
      const player = this.getPlayer(data.id);
      player?.handleMessage(data);
    });

    /*gameMaster.addAction("enemy", (data: EnemyUpdate) => {
      this.enemies?.handleMessage(data);
    });*/
  }

  private onEnemyKilled(enemy: Enemy) {
    this.kills++;
    this.killsPerPlayer[enemy.damagerId] =
      (this.killsPerPlayer[enemy.damagerId] || 0) + 1;
    this.rage = Math.ceil(this.rage) + 1;
  }
}
