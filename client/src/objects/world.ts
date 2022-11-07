import { Player } from "./player";
import { BulletGroup } from "../groups/bulletGroup";
import { GuestMaster } from "../gameMaster/guestMaster";
import { PlayerControls } from "../controls/playerControls";
import { EnemyGroup } from "../groups/enemyGroup";
import { WorldState } from "../../../common/types/state";

export class World {
  // @ts-ignore
  players: Player[];
  enemies: EnemyGroup;
  // @ts-ignore
  playerControls: PlayerControls;
  // @ts-ignore
  bulletGroup: BulletGroup;
  gameMaster: GuestMaster;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gameMaster: GuestMaster) {
    this.gameMaster = gameMaster;
    this.scene = scene;
    this.enemies = new EnemyGroup(scene, 5);

    this.setupGameMaster(gameMaster);
    this.setupFirstPlayer(scene, gameMaster);
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

  private setupFirstPlayer(scene: Phaser.Scene, gameMaster: GuestMaster) {
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

  private setupGameMaster(gameMaster: GuestMaster) {
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
