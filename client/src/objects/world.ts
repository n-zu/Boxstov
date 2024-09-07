import { Player } from "./player";
import { BulletGroup } from "../groups/bulletGroup";
import { GameMaster } from "../gameMaster/gameMaster";
import { PlayerControls } from "../controls/playerControls";
import { EnemyGroup } from "../groups/enemyGroup";
import { WorldState } from "../../../common/types/state";
import { SyncUpdate } from "../../../common/types/messages";
import Observer from "../../../common/observer/observer.js";
import WorldStats from "./worldStats.js";
import { Difficulty } from "../../../common/enemyGroupModel";
import { WorldModel } from "../../../common/worldModel";
import PlayerModel from "../../../common/playerModel";
import { GameEvents } from "../../../common/types/events";

export class World extends WorldModel {
  stats: WorldStats;
  playerControls?: PlayerControls;
  gameMaster: GameMaster;

  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>, gameMaster: GameMaster, username: string) {
    super(scene, observer);
    this.gameMaster = gameMaster;
    this.stats = new WorldStats(observer);
    
    this.setupGameMaster(gameMaster);
    this.setupFirstPlayer(scene, gameMaster, username);
  }

  public update() {
    if (this.playerControls && this.players.length > 0) {
      this.playerControls.update(this.players[0] as Player);
    }
    super.update();
  }

  protected newBulletGroup(scene: Phaser.Scene, observer: Observer<GameEvents>) {
    return new BulletGroup(scene, observer);
  }

  protected newEnemyGroup(scene: Phaser.Scene, observer: Observer<GameEvents>, difficulty: Difficulty, spawnPoints: { x: number; y: number }[]) {
    return new EnemyGroup(scene, observer, difficulty, spawnPoints);
  }

  protected newPlayer(id: string, scene: Phaser.Scene, observer: Observer<GameEvents>, position: { x: number; y: number }, bullets: BulletGroup) {
    const local = this.players.length === 0;
    return new Player(id, scene, observer, position, this.gameMaster, bullets, local);
  }

  public sync(worldState: WorldState) {
    worldState.players.forEach((playerState) => {
      const player = this.getOrCreatePlayer(playerState.id) as Player;
      player.sync(playerState, this.getRecentEventsOfPlayer(playerState.id, worldState));
    });
    (this.enemies as EnemyGroup).sync(worldState.enemies);

    (this.bullets as BulletGroup).sync(worldState.bullets);
    this.stats.sync(worldState.stats);
  }

  private getRecentEventsOfPlayer(id: string, state: WorldState) {
    const recentEvents = state.recentEvents.playerRecentEvents[id];
    if (recentEvents === undefined) {
      return [];
    }
    return recentEvents;
  }

  private setupFirstPlayer(
    scene: Phaser.Scene,
    gameMaster: GameMaster,
    username: string
  ) {
    const player = new Player(
      username,
      scene,
      this.observer,
      { x: 0, y: 0 },
      gameMaster,
      this.bullets,
      true
    );
    this.playerControls = new PlayerControls(this.scene, player, this.observer);

    setInterval(() => {
      this.gameMaster.send("player", {
        id: username,
        type: "ping"
      });
    }, 500);

    this.players = [player];
  }

  public getOrCreatePlayer(id: string): PlayerModel {
    let player = this.players.find((p) => p.id === id);
    if (player === undefined) {
      player = this.newPlayer(id, this.scene, this.observer, { x: 0, y: 0 }, this.bullets as BulletGroup);
      this.players.push(player);
    }
    return player;
  }

  private setupGameMaster(gameMaster: GameMaster) {
    gameMaster.addAction("sync", (data: SyncUpdate) => {
      this.sync(data);
    });
  }
}
