import { Direction } from "../../../common/types/direction";
import { AnimationActor, AnimationSuffix } from "../types/animation";
import { WorldState } from "../../../common/types/state";
import { MultiplayerGame } from "../game/multiplayerGame";
import { World } from "../objects/world";
import { loadGameAssets } from "./load";
import Sprite = Phaser.GameObjects.Sprite;
import { GameMaster } from "../gameMaster/gameMaster";
import UI from "./ui";

export function playAnimation(
  sprite: Sprite,
  actor: AnimationActor,
  direction: Direction,
  suffix: AnimationSuffix,
  startFrame?: number
) {
  sprite.anims.play(
    {
      key: `${actor}-${direction}-${suffix}`,
      startFrame: startFrame || 0,
    },
    true
  );
}

export default class MainScene extends Phaser.Scene {
  gameMaster?: GameMaster;
  world?: World;

  protected constructor() {
    super({ key: "MainScene" });
  }

  create(data: { gameMaster: GameMaster }) {
    this.gameMaster = data.gameMaster;
    this.world = new World(this, data.gameMaster);
    this.add.tileSprite(0, 0, 7680, 4320, "tiles").setDepth(-9999);
    this.scene.add("UI", UI, true, { gameMaster: data.gameMaster });
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
