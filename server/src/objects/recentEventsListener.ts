import Observer from "../../../common/observer/observer.js";
import PlayerModel from "../../../common/playerModel.js";
import { GameEvents } from "../../../common/types/events.js";
import { RecentEventsListenerState } from "../../../common/types/state.js";
import { PlayerRecentEvents as PlayerRecentEventsProto } from "../../../common/generated/recentEventsListener.js";
import { PlayerRecentEvent as PlayerRecentEventProto } from "../../../common/generated/playerRecentEvent.js";

export default class RecentEventsListener {
    playerRecentEvents: { [playerId: string]: PlayerRecentEventProto[] } = {};

    constructor(obs: Observer<GameEvents>) {
        obs.subscribe("playerReceivedDamage", (player: PlayerModel) => {
            this.addPlayerEvent(player.id, PlayerRecentEventProto.ReceiveDamage);
        });

        obs.subscribe("playerShoot", (shooter: PlayerModel) => {
            this.addPlayerEvent(shooter.id, PlayerRecentEventProto.Shoot);
        });
    }

    private addPlayerEvent(playerId: string, event: PlayerRecentEventProto) {
        if (!this.playerRecentEvents[playerId]) {
            this.playerRecentEvents[playerId] = [];
        }
        this.playerRecentEvents[playerId].push(event);
    }

    public getState(): RecentEventsListenerState {
        var state: {[playerId: string]: PlayerRecentEventsProto} = {};

        for (const playerId in this.playerRecentEvents) {
            state[playerId] = { playerRecentEvents: this.playerRecentEvents[playerId] };
        }

        this.clearRecentEvents();
        return { playerRecentEvents: state};
    }

    private clearRecentEvents() {
        this.playerRecentEvents = {};
    }
}