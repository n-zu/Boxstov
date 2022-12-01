import { Player } from "./player.js";
import { BulletGroup } from "../groups/bulletGroup.js";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { Enemy } from "./enemy.js";
import { Bullet } from "./bullet.js";
import { Difficulty, EnemyGroup } from "../groups/enemyGroup.js";
import { WorldState, WorldStats } from "../../../common/types/state.js";
import { PlayerUpdate } from "../../../common/types/messages.js";
import { ENEMY_GROUP_MAX } from "../../../common/constants.js";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events.js";

const INACTIVE_THRESHOLD = 60000; // if 60 seconds pass, the player is considered inactive

export class World {
  players: Player[];
  enemies?: EnemyGroup;
  bulletGroup: BulletGroup;
  gameMaster: GameMaster;
  scene: Phaser.Scene;
  observer: Observer<GameEvents>;
  stats: WorldStats = {
    kills: 0,
    killsPerPlayer: {},
    rage: 0
  };
  onEnd: () => void;

  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>, gameMaster: GameMaster, onEnd: () => void) {
    this.players = [];
    this.observer = observer;
    this.bulletGroup = new BulletGroup(scene, observer);
    this.gameMaster = gameMaster;
    this.scene = scene;
    this.onEnd = onEnd;
  }

  public create() {
    const spawnPoints = this.getSpawnPoints();

    this.enemies = new EnemyGroup(
      this.scene,
      this.observer,
      ENEMY_GROUP_MAX,
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

    this.subscribeToEvents();
  }

  public update() {
    const isActive = (p: Player) =>
      Date.now() - INACTIVE_THRESHOLD < p.lastUpdate;
    this.players = this.players.filter(isActive);
    if (!this.players.length) this.onEnd();
    this.enemies?.update(this.players);
    this.stats.rage = Math.max(0, this.stats.rage - 0.002);
  }

  public getState(): WorldState {
    return {
      players: this.players.map((player) => player.getState()),
      bullets: this.bulletGroup.getState(),
      stats: {
        rage: this.stats.rage,
        kills: this.stats.kills,
        killsPerPlayer: this.stats.killsPerPlayer
      },
      enemies: this.enemies!.getState()
    };
  }

  // Returns false if that id is already taken
  public addPlayer(id: string): boolean {
    if (this.players.some((p) => p.id === id)) return false;
    const player = new Player(
      this.scene,
      this.observer,
      id,
      this.gameMaster
    );
    this.players.push(player);
    return true;
  }

  private subscribeToEvents() {
    this.observer.subscribe("enemyKilled", killerId =>
      this.onEnemyKilled(killerId)
    );
  }

  private getSpawnPoints(): { x: number; y: number }[] {
    const center = { x: 0, y: 0 };
    const radius = 1000;
    const spawnPoints = [];
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      spawnPoints.push({ x, y });
    }
    return spawnPoints;
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

  private onEnemyKilled(killerId: string) {
    this.stats.kills++;
    this.stats.killsPerPlayer[killerId] =
      (this.stats.killsPerPlayer[killerId] || 0) + 1;
    this.stats.rage = Math.ceil(this.stats.rage) + 1;
  }
}
