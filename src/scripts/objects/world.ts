import { Player } from "./player";
import { BulletGroup } from "./bulletGroup";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export class World {
  players: Player[];
  bulletsGroup: BulletGroup;

  constructor(players: Player[], scene: Phaser.Scene) {
    this.players = players;
    this.bulletsGroup = new BulletGroup(scene);
  }

  public updatePlayerPosition(playerId: number, cursorKeys: CursorKeys) {
    this.players[playerId].update(cursorKeys);
  }

  public update() {
    // TODO
  }

  public shoot(playerId: number, x: number, y: number) {
    this.players[playerId].shootInWorld(x, y, this);
  }

  public spawnBullet(x: number, y: number, angle: number) {
    this.bulletsGroup.shootBullet(x, y, angle);
  }

  public movePlayerUp(id: number) {
    this.players[id].moveUp();
  }

  public movePlayerDown(id: number) {
    this.players[id].moveDown();
  }

  public movePlayerLeft(id: number) {
    this.players[id].moveLeft();
  }

  public movePlayerRight(id: number) {
    this.players[id].moveRight();
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
