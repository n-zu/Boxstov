import { World, WorldState } from "../objects/world.js";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { Direction } from "../objects/player.js";
import Sprite = Phaser.Physics.Arcade.Sprite;
import {MultiplayerGame} from "../game.js";
import Peer from "peerjs";
import {geckos} from "@geckos.io/server";

export default class MainScene extends Phaser.Scene {
  // @ts-ignore
  game: MultiplayerGame;
  // @ts-ignore
  world: World;
  // @ts-ignore
  gameMaster: GameMaster;
  // @ts-ignore
  io: GeckosServer;

  protected constructor() {
    super({ key: "MainScene" });

    // @ts-ignore
    const peer = new Peer("efoppiano")
    // @ts-ignore
    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id)
    });
  }

  public create() {
    console.log(this);
    this.game = this.game as MultiplayerGame;
    this.gameMaster = this.game.gameMaster;
    this.world = new World(this, this.game.gameMaster);
  }

  public getState(): WorldState {
    return this.world.getState();
  }

  public sync(worldState: WorldState) {
    this.world.sync(worldState);
  }

  update() {
    if (this.gameMaster.shouldSendSync()) {
      this.world.update();
      this.gameMaster.send("sync", this.world.getState());
    } else {
      this.world.playerControls.update();
    }
  }
}
