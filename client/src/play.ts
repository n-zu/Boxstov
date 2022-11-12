import "phaser";
import MainScene from "./scenes/mainScene";
import { MultiplayerGame } from "./game/multiplayerGame";
import { GuestMaster } from "./gameMaster/guestMaster";
import "./styles/menu.css";

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
    height: DEFAULT_HEIGHT,
  },
  scene: [MainScene],
  antialias: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  transparent: true,
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
  const gameMaster = new GuestMaster();
  new MultiplayerGame(gameConfig, gameMaster);
});

console.log("Hello");
