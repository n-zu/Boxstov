// World

import { GunType } from "../generated/player/playerArsenal";
import { RecentEventsListener } from "../generated/recentEventsListener";
import { DirectionEnum } from "../generated/utils/direction";
import { Position } from "../generated/utils/position";

export type WorldState = string;

export type WorldStatsState = {
  kills: number;
  killsPerPlayer: { [playerId: string]: number };
  rage: number;
};

// Enemy

export type EnemyState = {
  position: {
    x: number;
    y: number;
  };
  physique: EnemyPhysiqueState;
  dead: boolean;
  action: string;
  spawned: boolean;
  angle: number;
};

export type EnemyPhysiqueState = {
  maxHealth: number;
  health: number;
  strength: number;
  speed: number;
  attackRange: number;
}

export type EnemyGroupState = {
  enemies: EnemyState[];
  timeUntilNextHorde: number;
  spawnPoints: Position[];
};

export type SpawnPoint = {
  x: number;
  y: number;
};

// Player

export type PlayerState = {
  id: string;
  position: Position;
  facing: DirectionEnum;
  idle: boolean;
  health: number;
  arsenal: PlayerArsenalState;
};

export type PlayerArsenalState = {
  currentGun: GunType;
  kills: number;
};

// Bullet

export type BulletGroupState = { bullets: BulletState[] };

export type BulletState = {
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  active: boolean;
  visible: boolean;
  origin: GunType;
};

// Recent events listener

export type RecentEventsListenerState = RecentEventsListener;