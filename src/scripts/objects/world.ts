import { Player, PlayerState } from "./player";
import MainScene from "../scenes/mainScene";

export type WorldState = {
  players: PlayerState[];
};

export class World {
  players: Player[];

  constructor(players: Player[]) {
    this.players = players;
  }

  public getState(): WorldState {
    return {
      players: this.players.map((player) => player.getState()),
    };
  }

  public update(playerId: number) {
    this.players[playerId].update();
  }

  public updateFor(playerId: number, worldState: WorldState) {
    this.players.forEach((player, index) => {
      // we may want to update the player after some time,
      // but not every frame
      if (index !== playerId) {
        player.updateWith(worldState.players[index]);
      }
    });
  }

  public updatePlayer(id: number, playerState: PlayerState) {
    this.players[id].updateWith(playerState);
  }

  public getPlayerState(playerId: number): PlayerState {
    return this.players[playerId].getState();
  }

  public shoot(playerId: number, x: number, y: number, scene: MainScene) {
    this.players[playerId].shoot(x, y, scene);
  }
}
