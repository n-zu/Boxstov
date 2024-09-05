import { Player } from "./player";
import { BulletGroup } from "../groups/bulletGroup";
import { GameMaster } from "../gameMaster/gameMaster";
import { PlayerControls } from "../controls/playerControls";
import { EnemyGroup } from "../groups/enemyGroup";
import { WorldState } from "../../../common/types/state";
import { SyncUpdate } from "../../../common/types/messages";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events";
import WorldStats from "./worldStats.js";
import config from "../../../common/config";

export class World {
  players!: Player[];
  enemies: EnemyGroup;
  observer: Observer<GameEvents>;
  stats: WorldStats;
  playerControls!: PlayerControls;
  bulletGroup!: BulletGroup;
  gameMaster: GameMaster;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>, gameMaster: GameMaster, username: string) {
    this.gameMaster = gameMaster;
    this.scene = scene;
    this.enemies = new EnemyGroup(scene, observer, config.misc.maxEnemies);
    this.stats = new WorldStats(observer);
    this.observer = observer;

    this.setupGameMaster(gameMaster);
    this.setupFirstPlayer(scene, gameMaster, username);
  }

  public update() {
    this.playerControls.update();
    this.players?.forEach((player) => player.update());
  }

  public sync(worldState: WorldState) {
    worldState.players.forEach((playerState) => {
      const player = this.getOrCreatePlayer(playerState.id);
      player.sync(playerState, this.getRecentEventsOfPlayer(playerState.id, worldState));
    });
    this.enemies.sync(worldState.enemies, worldState.recentEvents.enemyRecentEvents);

    this.bulletGroup.sync(worldState.bullets);
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
    this.bulletGroup = new BulletGroup(scene);

    const player = new Player(
      username,
      scene,
      this.observer,
      { x: 0, y: 0 },
      gameMaster,
      this.bulletGroup,
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

  private getOrCreatePlayer(id: string): Player {
    let player = this.players.find((p) => p.id === id);
    if (player === undefined) {
      player = new Player(
        id,
        this.scene,
        this.observer,
        { x: 0, y: 0 },
        this.gameMaster,
        this.bulletGroup
      );
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
