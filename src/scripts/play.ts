import "../styles/menu.css";
import "phaser";
import { HostMainScene } from "./scenes/hostMainScene";
import { GuestMainScene } from "./scenes/guestMainScene";
import { MultiplayerGame } from "./game/multiplayerGame";
import Peer from "peerjs";

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 200;
const URL_PREFIX = "http://localhost:8080";

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

function addUrl(id: string) {
  const url = `${URL_PREFIX}/play?id=${id}`;
  const anchor = document.getElementById("joinLink");
  if (anchor instanceof HTMLAnchorElement) {
    anchor.href = url;
  }
  const text = document.getElementById("joinText");
  if (text instanceof HTMLHeadingElement) {
    text.innerText = `Join with URL: ${url}`;
  }
}

window.addEventListener("load", () => {
  const params = new URL(document.location.toString()).searchParams;
  const join_id = params.get("id");
  const host_with = params.get("host_with");
  const peer = host_with ? new Peer(host_with) : new Peer();

  // If there's a join_id, we're joining.
  if (join_id) {
    console.log(`Joining game id: ${join_id}`);
    new MultiplayerGame(guestConfig, 1, join_id, peer);
    addUrl(join_id);
    return;
  }

  // No join_id: we're hosting.
  peer.on("open", (id) => {
    console.log(`Hosting game id: ${id}`);
    new MultiplayerGame(hostConfig, 0, id, peer);
    addUrl(id);
  });
});
