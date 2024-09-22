/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var player_player_pb = require('../player/player_pb.js');
var groups_bulletGroup_pb = require('../groups/bulletGroup_pb.js');
var groups_enemyGroup_pb = require('../groups/enemyGroup_pb.js');
var world_worldStats_pb = require('../world/worldStats_pb.js');
var recentEventsListener_pb = require('../recentEventsListener_pb.js');
goog.exportSymbol('proto.world.v1.World', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.world.v1.World = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.world.v1.World.repeatedFields_, null);
};
goog.inherits(proto.world.v1.World, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.world.v1.World.displayName = 'proto.world.v1.World';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.world.v1.World.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.world.v1.World.prototype.toObject = function(opt_includeInstance) {
  return proto.world.v1.World.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.world.v1.World} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.world.v1.World.toObject = function(includeInstance, msg) {
  var f, obj = {
    playersList: jspb.Message.toObjectList(msg.getPlayersList(),
    player_player_pb.Player.toObject, includeInstance),
    bullets: (f = msg.getBullets()) && groups_bulletGroup_pb.BulletGroup.toObject(includeInstance, f),
    enemies: (f = msg.getEnemies()) && groups_enemyGroup_pb.EnemyGroup.toObject(includeInstance, f),
    stats: (f = msg.getStats()) && world_worldStats_pb.WorldStats.toObject(includeInstance, f),
    recentevents: (f = msg.getRecentevents()) && recentEventsListener_pb.RecentEventsListener.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.world.v1.World}
 */
proto.world.v1.World.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.world.v1.World;
  return proto.world.v1.World.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.world.v1.World} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.world.v1.World}
 */
proto.world.v1.World.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new player_player_pb.Player;
      reader.readMessage(value,player_player_pb.Player.deserializeBinaryFromReader);
      msg.addPlayers(value);
      break;
    case 2:
      var value = new groups_bulletGroup_pb.BulletGroup;
      reader.readMessage(value,groups_bulletGroup_pb.BulletGroup.deserializeBinaryFromReader);
      msg.setBullets(value);
      break;
    case 3:
      var value = new groups_enemyGroup_pb.EnemyGroup;
      reader.readMessage(value,groups_enemyGroup_pb.EnemyGroup.deserializeBinaryFromReader);
      msg.setEnemies(value);
      break;
    case 4:
      var value = new world_worldStats_pb.WorldStats;
      reader.readMessage(value,world_worldStats_pb.WorldStats.deserializeBinaryFromReader);
      msg.setStats(value);
      break;
    case 5:
      var value = new recentEventsListener_pb.RecentEventsListener;
      reader.readMessage(value,recentEventsListener_pb.RecentEventsListener.deserializeBinaryFromReader);
      msg.setRecentevents(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.world.v1.World.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.world.v1.World.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.world.v1.World} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.world.v1.World.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPlayersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      player_player_pb.Player.serializeBinaryToWriter
    );
  }
  f = message.getBullets();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      groups_bulletGroup_pb.BulletGroup.serializeBinaryToWriter
    );
  }
  f = message.getEnemies();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      groups_enemyGroup_pb.EnemyGroup.serializeBinaryToWriter
    );
  }
  f = message.getStats();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      world_worldStats_pb.WorldStats.serializeBinaryToWriter
    );
  }
  f = message.getRecentevents();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      recentEventsListener_pb.RecentEventsListener.serializeBinaryToWriter
    );
  }
};


/**
 * repeated player.v1.Player players = 1;
 * @return {!Array<!proto.player.v1.Player>}
 */
proto.world.v1.World.prototype.getPlayersList = function() {
  return /** @type{!Array<!proto.player.v1.Player>} */ (
    jspb.Message.getRepeatedWrapperField(this, player_player_pb.Player, 1));
};


/** @param {!Array<!proto.player.v1.Player>} value */
proto.world.v1.World.prototype.setPlayersList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.player.v1.Player=} opt_value
 * @param {number=} opt_index
 * @return {!proto.player.v1.Player}
 */
proto.world.v1.World.prototype.addPlayers = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.player.v1.Player, opt_index);
};


proto.world.v1.World.prototype.clearPlayersList = function() {
  this.setPlayersList([]);
};


/**
 * optional bulletGroup.v1.BulletGroup bullets = 2;
 * @return {?proto.bulletGroup.v1.BulletGroup}
 */
proto.world.v1.World.prototype.getBullets = function() {
  return /** @type{?proto.bulletGroup.v1.BulletGroup} */ (
    jspb.Message.getWrapperField(this, groups_bulletGroup_pb.BulletGroup, 2));
};


/** @param {?proto.bulletGroup.v1.BulletGroup|undefined} value */
proto.world.v1.World.prototype.setBullets = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.world.v1.World.prototype.clearBullets = function() {
  this.setBullets(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.world.v1.World.prototype.hasBullets = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional enemyGroup.v1.EnemyGroup enemies = 3;
 * @return {?proto.enemyGroup.v1.EnemyGroup}
 */
proto.world.v1.World.prototype.getEnemies = function() {
  return /** @type{?proto.enemyGroup.v1.EnemyGroup} */ (
    jspb.Message.getWrapperField(this, groups_enemyGroup_pb.EnemyGroup, 3));
};


/** @param {?proto.enemyGroup.v1.EnemyGroup|undefined} value */
proto.world.v1.World.prototype.setEnemies = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.world.v1.World.prototype.clearEnemies = function() {
  this.setEnemies(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.world.v1.World.prototype.hasEnemies = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional worldStats.v1.WorldStats stats = 4;
 * @return {?proto.worldStats.v1.WorldStats}
 */
proto.world.v1.World.prototype.getStats = function() {
  return /** @type{?proto.worldStats.v1.WorldStats} */ (
    jspb.Message.getWrapperField(this, world_worldStats_pb.WorldStats, 4));
};


/** @param {?proto.worldStats.v1.WorldStats|undefined} value */
proto.world.v1.World.prototype.setStats = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


proto.world.v1.World.prototype.clearStats = function() {
  this.setStats(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.world.v1.World.prototype.hasStats = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional recentEventsListener.v1.RecentEventsListener recentEvents = 5;
 * @return {?proto.recentEventsListener.v1.RecentEventsListener}
 */
proto.world.v1.World.prototype.getRecentevents = function() {
  return /** @type{?proto.recentEventsListener.v1.RecentEventsListener} */ (
    jspb.Message.getWrapperField(this, recentEventsListener_pb.RecentEventsListener, 5));
};


/** @param {?proto.recentEventsListener.v1.RecentEventsListener|undefined} value */
proto.world.v1.World.prototype.setRecentevents = function(value) {
  jspb.Message.setWrapperField(this, 5, value);
};


proto.world.v1.World.prototype.clearRecentevents = function() {
  this.setRecentevents(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.world.v1.World.prototype.hasRecentevents = function() {
  return jspb.Message.getField(this, 5) != null;
};


goog.object.extend(exports, proto.world.v1);
