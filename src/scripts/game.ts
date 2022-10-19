import "phaser";
import { HostMainScene } from "./scenes/hostMainScene";
import { GuestMainScene } from "./scenes/guestMainScene";
import { MultiplayerGame } from "./game/multiplayerGame";
import Peer from "peerjs";

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 200;

const hostConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#ffffff",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [HostMainScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

const guestConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#ffffff",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [GuestMainScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

window.addEventListener("load", () => {
  const params = new URL(document.location.toString()).searchParams;
  const host_id = params.get("id");
  const peer = new Peer();

  // If there's a host_id, we're joining.
  if (host_id) {
    console.log(`Joining game id: ${host_id}`);
    new MultiplayerGame(guestConfig, 1, host_id, peer);
    return;
  }

  // No host_id: we're hosting.
  peer.on("open", (id) => {
    console.log(`Hosting game id: ${id}`);
    new MultiplayerGame(hostConfig, 0, id, peer);
  });
});
