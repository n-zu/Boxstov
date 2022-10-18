import PhaserLogo from "../objects/phaserLogo";
import FpsText from "../objects/fpsText";
import { Peer } from "peerjs";

type ExtendedGameType = Phaser.Game & {
  network_mode: "host" | "guest";
  network_host: Peer;
  network_guest: Peer;
};
const conn_id = "efoppiano";
const setupHost = (game: ExtendedGameType) => {
  console.log("Setting up host");
  const peer = new Peer(conn_id);
  peer.on("connection", (conn) => {
    conn.on("open", () => {
      console.log("connection open");
      conn.send("I am the host");
    });
    conn.on("data", (data) => {
      console.log("Received data", data);
    });
  });
  game.network_host = peer;
};
const setupGuest = (game: ExtendedGameType) => {
  console.log("Setting up guest");
  const peer = new Peer();
  peer.on("open", (id) => {
    console.log("Opened connection with id: " + id);
    const conn = peer.connect(conn_id);
    conn.on("open", () => {
      conn.send("I am the guest");
    });
    conn.on("data", (data) => {
      console.log("Received data", data);
    });
  });

  game.network_guest = peer;
};
const setup = (game: ExtendedGameType) => {
  if (game.network_mode === "host") {
    setupHost(game);
  } else if (game.network_mode === "guest") {
    setupGuest(game);
  }
};

export default class MainScene extends Phaser.Scene {
  fpsText;

  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    new PhaserLogo(this, this.cameras.main.width / 2, 0);
    this.fpsText = new FpsText(this);

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: "#000000",
        fontSize: "24px",
      })
      .setOrigin(1, 0);

    setup(this.game as ExtendedGameType);
  }

  update() {
    this.fpsText.update();
  }
}
