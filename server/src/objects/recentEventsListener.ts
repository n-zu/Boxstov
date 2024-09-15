import Observer from "../../../common/observer/observer.js";
import PlayerModel from "../../../common/playerModel.js";
import { GameEvents } from "../../../common/types/events.js";
import { PlayerRecentEvent, RecentEventsListenerState } from "../../../common/types/state.js";

export default class RecentEventsListener {
    playerRecentEvents: { [playerId: string]: PlayerRecentEvent[] } = {};

    constructor(obs: Observer<GameEvents>) {
        obs.subscribe("playerReceivedDamage", (player: PlayerModel) => {
            this.addPlayerEvent(player.id, "receive_damage");
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

    public getState(): RecentEventsListenerState {
        const state = {
            playerRecentEvents: this.playerRecentEvents,
        };
        this.clearRecentEvents();
        return state;
    }

    private clearRecentEvents() {
        this.playerRecentEvents = {};
    }
}