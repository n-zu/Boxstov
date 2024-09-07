import { Direction } from "../../../common/types/direction";
import { AnimationActor, AnimationSuffix } from "../types/animation";
import { WorldState } from "../../../common/types/state";
import { World } from "../objects/world";
import { loadGameAssets } from "./load";
import { GameMaster } from "../gameMaster/gameMaster";
import UI from "./ui";
import { GAME_HEIGHT, GAME_WIDTH, WORLD_BOUNDS } from "../../../common/constants";
import GameObserver from "../../../common/observer/gameObserver.js";
import GameUI from "../controls/gameUi";
import Observer from "../../../common/observer/observer";
import AudioPlayer from "../audio/audioPlayer";
import Sprite = Phaser.GameObjects.Sprite;
import { GunName } from "../../../common/guns/gun";
import { GameEvents } from "../../../common/types/events";
import AnimationPlayer from "../animations/animationPlayer";


export function playAnimation(
  sprite: Sprite,
  actor: AnimationActor | GunName,
  direction: Direction,
  suffix: AnimationSuffix,
  startFrame?: number
) {
  sprite.anims.play(
    {
      key: `${actor}-${direction}-${suffix}`,
      startFrame: startFrame || 0
    },
    true
  );
}

export default class MainScene extends Phaser.Scene {
  gameMaster?: GameMaster;
  world?: World;
  observer: Observer<GameEvents>;
  gameUi?: GameUI;
  audioPlayer: AudioPlayer;
  animationPlayer: AnimationPlayer;

  protected constructor() {
    super({ key: "MainScene" });
    this.observer = new GameObserver();
    this.audioPlayer = new AudioPlayer(this, this.observer);
    this.animationPlayer = new AnimationPlayer(this, this.observer);
  }

  create(data: { gameMaster: GameMaster; username: string }) {
    this.gameMaster = data.gameMaster;
    this.gameUi = new GameUI(this, this.observer);
    this.world = new World(this, this.observer, data.gameMaster, data.username);
    this.cameras.main.setBounds(...WORLD_BOUNDS);
    this.physics.world.setBounds(...WORLD_BOUNDS)

    this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, "tiles").setDepth(-9999);
    this.scene.add("UI", UI, true, {
      gameMaster: data.gameMaster,
      world: this.world
    });
  }

  public sync(worldState: WorldState) {
    this.world?.sync(worldState);
  }

  update() {
    this.world?.update();
  }

  preload() {
    loadGameAssets(this);
  }
}
