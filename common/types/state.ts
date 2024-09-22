// World

import { GunType } from "../generated/player/playerArsenal";

export type WorldState = {
  players: PlayerState[];
  bullets: BulletGroupState;
  enemies: EnemyGroupState;
  stats: WorldStatsState;
  recentEvents: RecentEventsListenerState;
};

export type WorldStatsState = {
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

export type EnemyGroupState = string;

export type SpawnPoint = {
  x: number;
  y: number;
};

// Player

export type PlayerState = string;

export type PlayerArsenalState = {
  currentGun: GunType;
  kills: number;
};

// Bullet

export type BulletGroupState = string;

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

export type RecentEventsListenerState = string;