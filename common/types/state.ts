// World

export type WorldState = {
  players: PlayerState[];
  bullets: BulletGroupState;
  enemies: EnemyGroupState;
};

// Enemy

export type EnemyState = {
  position: {
    x: number;
    y: number;
  };
  health: number;
  active: boolean;
  visible: boolean;
  bodyEnabled: boolean;
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
};

// Bullet

export type BulletGroupState = BulletState[];

export type BulletState = {
  x: number;
  y: number;
  rotation: number;
  active: boolean;
  visible: boolean;
};
