// World

import { EncodedMovementDirection } from "../controls/direction";
import { GunName } from "../guns";

export type WorldState = {
  players: PlayerState[];
  bullets: BulletGroupState;
  enemies: EnemyGroupState;
  stats: WorldStats;
};

export type WorldStats = {
  rage: number;
  kills: number;
  killsPerPlayer: Record<string, number>;
}

// Enemy

export type EnemyState = {
  position: {
    x: number;
    y: number;
  };
  movementDirection: EncodedMovementDirection;
  dead: boolean;
  health: number;
  active: boolean;
  visible: boolean;
  bodyEnabled: boolean;
  action: string;
  speed: number;
};

export type EnemyGroupState = {
  enemies: EnemyState[];
  timeUntilNextHorde: number;
  spawnPoints: SpawnPoint[];
};

export type SpawnPoint = {
  x: number;
  y: number;
};

// Player

export type PlayerState = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  health: number;
  movementDirection: EncodedMovementDirection;
  gunName: GunName;
  events: PlayerRecentEvent[];
};

export type PlayerRecentEvent = "shoot" | "receive_damage" | "kill" | "unlocked_gun";


// Bullet

export type BulletGroupState = BulletState[];

export type BulletState = {
  x: number;
  y: number;
  rotation: number;
  active: boolean;
  visible: boolean;
  gunName: GunName;
};
