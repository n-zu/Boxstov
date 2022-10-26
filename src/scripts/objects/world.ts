import { Player, PlayerState } from "./player";
import { BulletGroup, BulletGroupState } from "./bulletGroup";
import { GameMaster } from "../gameMaster";
import { PlayerControls } from "./playerControls";
import { Enemy, EnemyState } from "./enemy";
import { Bullet } from "./bullet";

export type WorldState = {
  players: PlayerState[];
  bullets: BulletGroupState;
  enemies: EnemyState[];
};

export class World {
  players: Player[];
  enemies: Enemy[];
  playerControls: PlayerControls;
  bulletGroup: BulletGroup;
  gameMaster: GameMaster;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gameMaster: GameMaster) {
    this.setupFirstPlayer(scene, gameMaster);

    this.gameMaster = gameMaster;
    this.scene = scene;

    this.setupGameMaster(gameMaster);

    this.enemies = [];
    for (let i = 0; i < 50; i++) {
      const enemy = new Enemy(scene, 500 + Math.random() * 500, 200);
      this.enemies.push(enemy);
      enemy.onAction("die", () => {
        enemy.destroy();
        this.enemies = this.enemies.filter(
          (anEnemy) => anEnemy.id !== enemy.id
        );
      });
    }

    scene.physics.add.overlap(this.bulletGroup, this.enemies, (e, b) => {
      const bullet = b as Bullet;
      const enemy = e as Enemy;
      if (bullet.active) {
        enemy.receiveDamage(bullet.damage);

        bullet.die();
      }
    });

    // Enemies repel each other
    scene.physics.add.collider(this.enemies, this.enemies);
  }

  public update() {
    this.playerControls.update();
    this.enemies.forEach((enemy) => {
      enemy.update(this.players);
    });
  }

  public sync(worldState: WorldState) {
    worldState.players.forEach((playerState) => {
      const player = this.getOrCreatePlayer(playerState.id);
      player.sync(playerState);
    });
    worldState.enemies.forEach((enemyState) => {
      const enemy = this.getOrCreateEnemy(enemyState.id);
      enemy.sync(enemyState);
    });
    this.enemies.forEach((enemy) => {
      if (!worldState.enemies.find((e) => e.id === enemy.id)) {
        enemy.destroy();

        this.enemies = this.enemies.filter((e) => e.id !== enemy.id);
      }
    });

    this.bulletGroup.sync(worldState.bullets);
  }

  public getState(): WorldState {
    return {
      players: this.players.map((player) => player.getState()),
      bullets: this.bulletGroup.getState(),
      enemies: this.enemies.map((enemy) => enemy.getState())
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
      {
        const canvas = document.querySelector("canvas");
        const sc = scene.cameras.main.zoom;
        if (canvas && canvas.style)
          canvas.style.backgroundSize = `${360 * sc}px ${200 * sc}px`;
      }
    });
  }

  private getOrCreatePlayer(id: string): Player {
    let player = this.players.find((p) => p.id === id);
    if (player === undefined) {
      player = new Player(
        this.scene,
        100,
        100,
        id,
        this.gameMaster,
        this.bulletGroup
      );
      this.players.push(player);
      this.gameMaster.send("sync", this.getState());
    }
    return player;
  }

  private getOrCreateEnemy(id: string): Enemy {
    let enemy = this.enemies.find((e) => e.id === id);
    if (enemy === undefined) {
      enemy = new Enemy(this.scene, 100, 100, id);
      this.enemies.push(enemy);
    }
    return enemy;
  }

  private setupGameMaster(gameMaster: GameMaster) {
    gameMaster.addAction("player", (data: any) => {
      const player = this.getOrCreatePlayer(data.id);
      player.handleMessage(data.payload);
    });

    gameMaster.addAction("sync", (data: any) => {
      this.sync(data);
    });
  }
}
