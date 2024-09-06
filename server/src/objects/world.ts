import { Player } from "../player/player.js";
import { BulletGroup } from "../groups/bulletGroup.js";
import { EnemyGroup } from "../groups/enemyGroup.js";
import { SpawnPoint, WorldState } from "../../../common/types/state.js";
import { PlayerUpdate } from "../../../common/types/messages.js";
import Observer from "../../../common/observer/observer.js";
import WorldStats from "./worldStats.js";
import RecentEventsListener from "./recentEventsListener.js";
import { GameEvents } from "../../../common/types/events.js";
import { WorldModel } from "../../../common/worldModel.js";
import { Difficulty, EnemyGroupModel } from "../../../common/enemyGroupModel.js";

const INACTIVE_THRESHOLD = 60000; // if 60 seconds pass, the player is considered inactive

export class World extends WorldModel {
  stats: WorldStats;
  recentEvents: RecentEventsListener;

  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>) {
    super(scene, observer);
    this.observer.subscribe("tick", () => this.update());
    
    this.stats = new WorldStats(observer);

    this.recentEvents = new RecentEventsListener(this.observer);
  }

  protected newBulletGroup(scene: Phaser.Scene, observer: Observer<GameEvents>) {
    return new BulletGroup(scene, observer);
  }

  protected newEnemyGroup(scene: Phaser.Scene, observer: Observer<GameEvents>, difficulty: Difficulty, spawnPoints: SpawnPoint[]): EnemyGroupModel {
    return new EnemyGroup(scene, observer, difficulty, spawnPoints);
  }

  protected newPlayer(id: string, scene: Phaser.Scene, observer: Observer<GameEvents>, position: { x: number; y: number }, bullets: BulletGroup) {
    return new Player(id, scene, observer, position, bullets);
  }

  public update() {
    const isActive = (p: Player) =>
      Date.now() - INACTIVE_THRESHOLD < p.lastUpdate;
    this.players = (this.players as Player[]).filter(isActive);

    if (!this.players.length) {
      this.observer.notify("gameEnd");
    }
    this.stats.update();
    super.update();
  }

  public getState(): WorldState {
    return {
      players: (this.players as Player[]).map((player) => player.getState()),
      bullets: (this.bullets as BulletGroup).getState(),
      stats: this.stats.getState(),
      enemies: (this.enemies as EnemyGroup).getState(),
      recentEvents: this.recentEvents.getState(),
    };
  }

  // Returns false if that id is already taken
  public addPlayer(id: string): boolean {
    if (this.players.some((p) => p.id === id)) return false;
    const player = new Player(
      id,
      this.scene,
      this.observer,
      { x: 0, y: 0 },
      this.bullets
    );
    this.players.push(player);
    return true;
  }

  public updatePlayer(data: PlayerUpdate) {
    const player = this.getPlayer(data.id);
    player?.handleMessage(data);
  }

  private getPlayer(id: string): Player | undefined {
    const player = this.players.find((p) => p.id === id);
    if (player) {
      return player as Player;
    } else {
      return undefined;
    }
  }
}
