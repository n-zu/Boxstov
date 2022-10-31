import "phaser";
import { MultiplayerGame } from "./game/multiplayerGame";
import MainScene from "./scenes/mainScene";
import { GuestMaster } from "./gameMaster/guestMaster";
import { UIScene } from "./scenes/uiScene";
import BootScene from "./scenes/bootScene";
import Peer from "peerjs";

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

const gameConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#ffffff",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [BootScene, MainScene, UIScene],
  antialias: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  transparent: true
};

export function addUrl(id: string) {
  const loc = window.location.href;
  const url = `${loc.split("play")[0]}play?id=${id}`;
  const anchor = document.getElementById("joinLink") as HTMLAnchorElement;
  anchor.href = url;
  const text = document.getElementById("joinText") as HTMLHeadingElement;
  text.innerText = `Join with URL: ${url}`;

  anchor.onclick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(url);
    text.innerText = "Copied to Clipboard!";
    setTimeout(() => {
      text.innerText = `Join with URL: ${url}`;
    }, 1000);
  };
}

window.addEventListener("load", () => {
  const join_id = "efoppiano";
  /*
  const body = document.getElementsByTagName("body")[0];
  const p = document.createElement("p");
  p.innerHTML = "Hello";
  body.appendChild(p);
  body.style.backgroundColor = "#ffffff";
  */


  const peer = new Peer();
  peer.on("open", (id) => {
    console.log("My peer ID is: " + id);
    const conn = peer.connect("efoppiano");
    conn.on("open", () => {
      console.log("Connected to peer");
      conn.send("Hello");
    });
    conn.on("data", (data) => {
      console.log(data);
    });
  });
});

console.log("Hello");