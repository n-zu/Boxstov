import { Player, PlayerState } from "./player";
import { BulletGroup, BulletGroupState } from "./bulletGroup";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export type WorldState = {
  players: PlayerState[];
  bullets: BulletGroupState;
};

export class World {
  players: Player[];
  bulletsGroup: BulletGroup;

  constructor(players: Player[], scene: Phaser.Scene) {
    this.players = players;
    this.bulletsGroup = new BulletGroup(scene);
  }

  public updatePlayerPosition(playerId: string, cursorKeys: CursorKeys) {
    this.players.find((p) => p.id == playerId)?.update(cursorKeys);
  }

  public update() {
    // TODO: update world
  }

  public sync(worldState: WorldState) {
    if (worldState.players.length != this.players.length) {
      // Add new ones
      worldState.players.forEach((player) => {
        const scene = this.players[0].scene;

        const found = this.players.find((p) => p.id == player.id);
        if (found == undefined) {
          this.players.push(
            new Player(scene, player.position.x, player.position.y, player.id)
          );
        }
      });
      // TODO: sync players
      // - Handle if someone disconnects
      // - Handle same num cuz x left and x joined (odd)
    }

    this.players.forEach((player) => {
      const playerState = worldState.players.find((p) => p.id === player.id);
      if (playerState) {
        // There is an error here probably
        player.sync(playerState);
      }
    });
    // TODO: sync bullets

    this.bulletsGroup.sync(worldState.bullets);
  }

  public getState(): WorldState {
    return {
      players: this.players.map((player) => player.getState()),
      bullets: this.bulletsGroup.getState(),
    };
  }

  public stop(playerId: string) {
    this.players.find((p) => p.id == playerId)?.stopMovement();
  }

  public shoot(playerId: string, x: number, y: number) {
    this.players.find((p) => p.id == playerId)?.shootInWorld(x, y, this);
  }

  public spawnBullet(x: number, y: number, angle: number) {
    this.bulletsGroup.shootBullet(x, y, angle);
  }

  public movePlayerUp(id: string) {
    this.players.find((p) => p.id == id)?.moveUp();
  }

  public movePlayerDown(id: string) {
    this.players.find((p) => p.id == id)?.moveDown();
  }

  public movePlayerLeft(id: string) {
    this.players.find((p) => p.id == id)?.moveLeft();
  }

  public movePlayerRight(id: string) {
    this.players.find((p) => p.id == id)?.moveRight();
  }

  /*
  public getState(): WorldState {
    let allies = this.allies.map((ally) => {
      return ally.getState();
    }) as AllyState[];

    return {
      allies: allies.concat(this.player.getState() as AllyState),
    };
  }

  public update() {
    this.player.update();
  }

  public updateWith(state: WorldState) {
    this.allies.forEach((ally, index) => {
      let allyState = state.allies[ally.getId()];
      ally.updateWith(allyState);
    });
  }

  public updateAlly(allyId: number, allyState: AllyState) {
    let ally = this.allies.find((ally) => {
      return ally.getId() === allyId;
    });
    if (ally) {
      ally.updateWith(allyState);
    }
  }

  public getPlayerState(): AllyState {
    return this.player.getState() as AllyState;
  }

  public getPlayerId(): number {
    return this.player.getId();
  }

  public shoot(x: number, y: number) {
    console.log("shoot from guest");
    this.player.shoot(x, y);
  }
   */
}