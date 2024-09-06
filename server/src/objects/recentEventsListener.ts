import { EnemyModel } from "../../../common/enemy/enemyModel.js";
import Observer from "../../../common/observer/observer.js";
import PlayerModel from "../../../common/playerModel.js";
import { GameEvents } from "../../../common/types/events.js";
import { EnemyRecentEvents, PlayerRecentEvent, RecentEventsListenerState } from "../../../common/types/state.js";

export default class RecentEventsListener {
    playerRecentEvents: { [playerId: string]: PlayerRecentEvent[] } = {};
    enemyRecentEvents: { [enemyId: number]: EnemyRecentEvents[] } = {};

    constructor(obs: Observer<GameEvents>) {
        obs.subscribe("playerReceivedDamage", (player: PlayerModel) => {
            this.addPlayerEvent(player.id, "receive_damage");
        });

        obs.subscribe("playerUnlockedGun", (player: PlayerModel) => {
            this.addPlayerEvent(player.id, "unlocked_gun");
        });

        obs.subscribe("enemyReceivedDamage", (enemy: EnemyModel) => {
            this.addEnemyEvent(enemy.id, "receive_damage");
        });

        obs.subscribe("playerKill", (killer: PlayerModel) => {
            this.addPlayerEvent(killer.id, "kill");
        });

        obs.subscribe("playerShoot", (shooter: PlayerModel) => {
            this.addPlayerEvent(shooter.id, "shoot");
        });
    }

    private addPlayerEvent(playerId: string, event: PlayerRecentEvent) {
        if (!this.playerRecentEvents[playerId]) {
            this.playerRecentEvents[playerId] = [];
        }
        this.playerRecentEvents[playerId].push(event);
    }

    private addEnemyEvent(enemyId: number, event: EnemyRecentEvents) {
        if (!this.enemyRecentEvents[enemyId]) {
            this.enemyRecentEvents[enemyId] = [];
        }
        this.enemyRecentEvents[enemyId].push(event);
    }

    public getState(): RecentEventsListenerState {
        const state = {
            playerRecentEvents: this.playerRecentEvents,
            enemyRecentEvents: this.enemyRecentEvents
        };
        this.clearRecentEvents();
        return state;
    }

    private clearRecentEvents() {
        this.playerRecentEvents = {};
        this.enemyRecentEvents = {};
    }
}