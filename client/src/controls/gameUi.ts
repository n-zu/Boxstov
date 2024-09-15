import { PlayerUI } from "./playerUi.js";
import Observer from "../../../common/observer/observer";
import { Player } from "../objects/player";
import { GameEvents } from "../../../common/types/events.js";
import PlayerModel from "../../../common/playerModel.js";

const motivationalMessages = [
  "GIT GUD",
  "You've been killed to death",
  "💀💀💀"
];

export default class GameUI {
  scene: Phaser.Scene;
  playerUis: PlayerUI[] = [];
  observer: Observer<GameEvents>;
  gameOver = false;

  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>) {
    this.scene = scene;
    this.observer = observer;

    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    this.observer.subscribe("newPlayer", (player: PlayerModel) => {
      this.playerUis.push(new PlayerUI(this.scene, player.id));
    });

    // TODO: there is no entity that notifies about this event
    this.observer.subscribe("playerLeft", (player: PlayerModel) => {
      this.playerUis = this.playerUis.filter((playerUi) => playerUi.username !== player.id);
    });

    this.observer.subscribe("playerUpdate", (player: PlayerModel) => {
      const playerUi = this.playerUis.find((playerUi) => playerUi.username === player.id);
      if (playerUi) {
        playerUi.update(player.x, player.y, player.height, player.health, player.maxHealth);
      }
    });

    this.observer.subscribe("playerDied", (player: PlayerModel) => {
      const p = player as Player;
      if (p.local && !this.gameOver) {
        this.gameOver = true;
        this.scene.scene.start("gameOver");
        this.showMotivationalMessage();
      }
    });
  }

  private showMotivationalMessage() {
    alert(
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
        ]
    );
    window.location.reload();
  }
}