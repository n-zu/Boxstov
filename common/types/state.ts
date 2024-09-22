// World

import { GunType } from "../generated/player/playerArsenal";
import { GunName } from "../guns/gun";

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

export type PlayerRecentEvent = "shoot" | "receive_damage";


// Bullet

export type BulletGroupState = BulletState[];

export type BulletState = string;

// Recent events listener

export type RecentEventsListenerState = {
  playerRecentEvents: { [playerId: string]: PlayerRecentEvent[] };
};