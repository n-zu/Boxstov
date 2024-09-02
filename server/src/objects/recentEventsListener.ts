import Observer from "../../../common/observer/observer.js";
import { EnemyRecentEvents, PlayerRecentEvent, RecentEventsListenerState } from "../../../common/types/state.js";
import { GameEvents } from "../types/events.js";

export default class RecentEventsListener {
    playerRecentEvents: { [playerId: string]: PlayerRecentEvent[] } = {};
    enemyRecentEvents: { [enemyId: number]: EnemyRecentEvents[] } = {};

    constructor(obs: Observer<GameEvents>) {
        obs.subscribe("playerReceivedDamage", (playerId: string) => {
            this.addPlayerEvent(playerId, "receive_damage");
        });

        obs.subscribe("unlockedGun", (playerId: string) => {
            this.addPlayerEvent(playerId, "unlocked_gun");
        });

        obs.subscribe("enemyReceivedDamage", (enemyId: number) => {
            this.addEnemyEvent(enemyId, "receive_damage");
        });

        obs.subscribe("enemyKilled", (killerId: string) => {
            this.addPlayerEvent(killerId, "kill");
        });

        obs.subscribe("shootBullet", (info) => {
            this.addPlayerEvent(info.playerId, "shoot");
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