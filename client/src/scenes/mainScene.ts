import { Direction } from "../../../common/types/direction";
import { AnimationActor, AnimationSuffix } from "../types/animation";
import { WorldState } from "../../../common/types/state";
import { World } from "../objects/world";
import { loadGameAssets } from "./load";
import Sprite = Phaser.GameObjects.Sprite;
import { GameMaster } from "../gameMaster/gameMaster";
import UI from "./ui";
import { GAME_HEIGHT, GAME_WIDTH } from "../../../common/constants";
import { GunName } from "../../../common/guns";


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

  create(data: { gameMaster: GameMaster; username: string }) {
    this.gameMaster = data.gameMaster;
    this.world = new World(this, data.gameMaster, data.username);

    this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, "tiles").setDepth(-9999);
    this.scene.add("UI", UI, true, {
      gameMaster: data.gameMaster,
      world: this.world,
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
