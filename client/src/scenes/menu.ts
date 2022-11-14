import Phaser from "phaser";
import { GuestMaster } from "../gameMaster/guestMaster";
import { SessionMaster } from "../gameMaster/sessionMaster";
import { loadMenuAssets, MenuData } from "./load";
import MainScene from "./mainScene";
import Spinner from "./spinner";

const TEXT_STYLE = {
  font: "30px monospace",
};
const ID_PREFIX_STYLE = {
  font: "25px monospace",
};
const ID_STYLE = {
  font: "bold 25px monospace",
};
const ERROR_STYLE = {
  font: "25px monospace",
  color: "#AA4A44",
};

export default class Menu extends Phaser.Scene {
  nameInput?: HTMLInputElement;
  idInput?: HTMLInputElement;
  errorText?: Phaser.GameObjects.Text;
  guestMaster?: GuestMaster;

  constructor() {
    super({ key: "Menu" });
  }

  create({ guestMaster }: MenuData) {
    this.guestMaster = guestMaster;
    this.addCallbacks();

    const params = new URLSearchParams(window.location.search);
    const joinId = params.get("join");

    this.add.tileSprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      "squares"
    );

    this.addLogo(-250);
    this.addNameInput(-100);
    if (joinId) {
      this.addJoinIdText(joinId, 50);
      this.addPlayButton("Join Game", () => this.joinGame(joinId), 150);
    } else {
      this.addPlayButton("New Game", () => this.newGame(), 150);
    }
    this.addErrorText(300);

    this.scene.add("MainScene", MainScene, false);
    this.scene.add("Spinner", Spinner, false);
  }

  preload() {
    loadMenuAssets(this);
  }

  private getX(offset: number = 0) {
    return this.cameras.main.centerX + offset;
  }

  private getY(offset: number = 0) {
    return this.cameras.main.centerY + offset;
  }

  private addLogo(offsetY: number = 0) {
    this.add.sprite(this.getX(), this.getY(offsetY), "logo").setScale(0.25);
  }

  private addNameInput(offsetY: number = 0) {
    this.add
      .text(this.getX(), this.getY(offsetY), "Username", TEXT_STYLE)
      .setOrigin(0.5);
    this.nameInput = this.add
      .dom(this.getX(), this.getY(offsetY) + 50)
      .createFromCache("input")
      .getChildByID("input") as HTMLInputElement;

    // Remove when sleeping
    this.scene.get("Menu").events.addListener("sleep", () => {
      this.nameInput?.classList.add("invisible");
    });
    this.scene.get("Menu").events.addListener("wake", () => {
      this.nameInput?.classList.remove("invisible");
    });

    this.nameInput?.addEventListener("input", () => {
      this.nameInput?.classList.remove("error");
      this.errorText?.setText("");
    });
    this.nameInput.setAttribute("placeholder", "Username");
  }

  private addPlayButton(
    text: string,
    callback: () => void,
    offsetY: number = 0
  ) {
    const button = this.add
      .text(this.getX(), this.getY(offsetY), text, TEXT_STYLE)
      .setPadding(20, 10)
      .setOrigin(0.5)
      .setStyle({ backgroundColor: "#03989E", fill: "#fff" })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => callback())
      .on("pointerover", () => button.setStyle({ fill: "#ccc" }))
      .on("pointerout", () => button.setStyle({ fill: "#fff" }));
  }

  private addJoinIdText(joinId: string, offsetY: number = 0) {
    const prefix = this.add
      .text(0, 0, `Joining game `, ID_PREFIX_STYLE)
      .setOrigin(0, 0.5);
    const id = this.add.text(0, 0, joinId, ID_STYLE).setOrigin(0, 0.5);
    const totalWidth = prefix.width + id.width;
    prefix.setPosition(this.getX() - totalWidth / 2, this.getY(offsetY));
    id.setPosition(prefix.x + prefix.width, prefix.y);
  }

  private addErrorText(offsetY: number = 0) {
    this.errorText = this.add
      .text(this.getX(), this.getY(offsetY), "", ERROR_STYLE)
      .setOrigin(0.5);
  }

  private addCallbacks() {
    let done = false;
    this.guestMaster?.addCallback("gameInfo", () => {
      if (done) return false; // make sure we only do this once

      done = true;
      const sessionMaster = new SessionMaster(this.guestMaster!);
      this.scene.start("MainScene", {
        username: this.nameInput!.value,
        gameMaster: sessionMaster,
      });
      this.scene.stop("Spinner");
      this.scene.stop();
      return false;
    });

    this.guestMaster?.addCallback("invalidId", () => {
      if (done) return false;
      this.scene.wake();
      this.scene.stop("Spinner");
      this.errorText?.setText("Invalid game ID. Check the URL and try again.");
      return true;
    });

    this.guestMaster?.addCallback("nameTaken", () => {
      if (done) return false;
      this.scene.wake();
      this.scene.stop("Spinner");
      this.nameInput?.focus();
      this.nameInput?.classList.add("error");
      this.errorText?.setText("That name is already taken. Try another.");
      return true;
    });
  }

  private newGame() {
    if (!this.checkName()) return false;
    this.scene.start("Spinner");
    this.scene.sleep();
    this.guestMaster?.send(
      "createGame",
      {
        username: this.nameInput!.value,
      },
      true
    );
  }

  private joinGame(gameId: string) {
    if (!this.checkName()) return false;
    this.scene.sleep();
    this.scene.run("Spinner");
    this.guestMaster?.send(
      "joinGame",
      {
        gameId,
        username: this.nameInput!.value,
      },
      true
    );
  }

  private checkName(): boolean {
    const name = this.nameInput?.value;
    if (!name) {
      this.nameInput?.focus();
      this.nameInput?.classList.add("error");
      this.errorText?.setText("Please enter your username");
      return false;
    }
    return true;
  }
}

/*
  const returnKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.ENTER
  );
  returnKey.on("down", () => {
    console.log("Enter pressed");
  });
*/