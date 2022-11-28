import { BufferSchema, geckosArraySchemas } from "../../server/src/server";

const unitVectorSchema = BufferSchema.schema("unitVector", {
  x: geckosArraySchemas.float32,
  y: geckosArraySchemas.float32
});

const enemySchema = BufferSchema.schema("enemy", {
  position: {
    x: geckosArraySchemas.float32,
    y: geckosArraySchemas.float32
  },
  movementDirection: unitVectorSchema,
  dead: geckosArraySchemas.bool8,
  health: geckosArraySchemas.uint8,
  active: geckosArraySchemas.bool8,
  visible: geckosArraySchemas.bool8,
  bodyEnabled: geckosArraySchemas.bool8,
  action: geckosArraySchemas.string8
});

const gunNameSchema = BufferSchema.schema("gunName", {
  gunName: geckosArraySchemas.string8
});

const playerSchema = BufferSchema.schema("player", {
  id: geckosArraySchemas.string8,
  position: {
    x: geckosArraySchemas.float32,
    y: geckosArraySchemas.float32
  },
  health: geckosArraySchemas.uint8,
  movementDirection: unitVectorSchema,
  gunName: gunNameSchema
});

const bulletSchema = BufferSchema.schema("bullet", {
  x: geckosArraySchemas.float32,
  y: geckosArraySchemas.float32,
  rotation: geckosArraySchemas.float32,
  active: geckosArraySchemas.bool8,
  visible: geckosArraySchemas.bool8,
  gunName: gunNameSchema
});

const killsPerPlayerSchema = BufferSchema.schema("killsPerPlayer", {
  player: geckosArraySchemas.string8,
  kills: geckosArraySchemas.uint32
});

const worldSchema = BufferSchema.schema("world", {
  players: [playerSchema],
  bullets: [bulletSchema],
  enemies: [enemySchema],
  rage: geckosArraySchemas.uint8,
  kills: geckosArraySchemas.uint8,
  killsPerPlayer: [killsPerPlayerSchema]
});

export const enemyModel = new geckosArraySchemas.Model(enemySchema);
export const playerModel = new geckosArraySchemas.Model(playerSchema);
export const bulletModel = new geckosArraySchemas.Model(bulletSchema);
export const worldModel = new geckosArraySchemas.Model(worldSchema);
