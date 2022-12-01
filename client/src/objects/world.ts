import { Player } from "./player";
import { BulletGroup } from "../groups/bulletGroup";
import { GameMaster } from "../gameMaster/gameMaster";
import { PlayerControls } from "../controls/playerControls";
import { EnemyGroup } from "../groups/enemyGroup";
import { WorldState, WorldStats } from "../../../common/types/state";
import { SyncUpdate } from "../../../common/types/messages";
import { ENEMY_GROUP_MAX } from "../../../common/constants";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events";

export class World {
  players!: Player[];
  enemies: EnemyGroup;
  observer: Observer<GameEvents>;
  stats: WorldStats = {
    kills: 0,
    killsPerPlayer: {},
    rage: 0
  };
  playerControls!: PlayerControls;
  bulletGroup!: BulletGroup;
  gameMaster: GameMaster;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>, gameMaster: GameMaster, username: string) {
    this.gameMaster = gameMaster;
    this.scene = scene;
    this.enemies = new EnemyGroup(scene, ENEMY_GROUP_MAX);
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
      player.sync(playerState);
    });
    this.enemies.sync(worldState.enemies);

    this.bulletGroup.sync(worldState.bullets);

    this.stats.rage = worldState.stats.rage;
    this.stats.kills = worldState.stats.kills;
    this.stats.killsPerPlayer = worldState.stats.killsPerPlayer;
  }

  private setupFirstPlayer(
    scene: Phaser.Scene,
    gameMaster: GameMaster,
    username: string
  ) {
    this.bulletGroup = new BulletGroup(scene);

    const player = new Player(
      scene,
      this.observer,
      username,
      gameMaster,
      this.bulletGroup,
      true
    );
    this.playerControls = new PlayerControls(this.scene, this.observer);

    setInterval(() => {
      this.gameMaster.send("player", {
        id: username,
        type: "ping"
      });
    }, 500);

    this.players = [player];


    scene.cameras.main.startFollow(player);
    scene.cameras.main.zoom = 0.6;

    // @ts-ignore
    scene.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      scene.cameras.main.zoom -= deltaY * 0.001;
      if (scene.cameras.main.zoom < 0.2) scene.cameras.main.zoom = 0.2;
      if (scene.cameras.main.zoom > 1) scene.cameras.main.zoom = 1;
    });
  }

  private getOrCreatePlayer(id: string): Player {
    let player = this.players.find((p) => p.id === id);
    if (player === undefined) {
      player = new Player(
        this.scene,
        this.observer,
        id,
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
