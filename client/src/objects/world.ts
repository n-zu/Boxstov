import { Player } from "./player";
import { BulletGroup } from "../groups/bulletGroup";
import { GameMaster } from "../gameMaster/gameMaster";
import { PlayerControls } from "../controls/playerControls";
import { EnemyGroup } from "../groups/enemyGroup";
import { WorldState } from "../../../common/types/state";
import {
  EnemyUpdate,
  PlayerUpdate,
  SyncUpdate,
} from "../../../common/types/messages";

export class World {
  players!: Player[];
  enemies: EnemyGroup;
  playerControls!: PlayerControls;
  bulletGroup!: BulletGroup;
  gameMaster: GameMaster;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gameMaster: GameMaster, username: string) {
    this.gameMaster = gameMaster;
    this.scene = scene;
    this.enemies = new EnemyGroup(scene, 5);

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
  }

  private setupFirstPlayer(
    scene: Phaser.Scene,
    gameMaster: GameMaster,
    username: string
  ) {
    this.bulletGroup = new BulletGroup(scene);

    const player = new Player(
      scene,
      800,
      500,
      username,
      gameMaster,
      this.bulletGroup
    );
    this.playerControls = new PlayerControls(player);

    setInterval(() => {
      this.gameMaster.send("player", {
        id: username,
        payload: {
          type: "ping",
        },
      });
    }, 500);

    this.players = [player];

    scene.cameras.main.startFollow(player);
    scene.cameras.main.zoom = 0.6;

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
    gameMaster.addAction("player", (data: PlayerUpdate) => {
      const player = this.getOrCreatePlayer(data.id);
      player.handleMessage(data.payload);
    });

    gameMaster.addAction("sync", (data: SyncUpdate) => {
      this.sync(data);
    });

    gameMaster.addAction("enemy", (data: EnemyUpdate) => {
      this.enemies.handleMessage(data);
    });
  }
}
