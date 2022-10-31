export type EnemyState = {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  health: number;
  active: boolean;
  visible: boolean;
  bodyEnabled: boolean;
  isFar: boolean;
};

export type EnemyGroupState = {
  enemies: EnemyState[];
};

export type PlayerState = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  health: number;
};
