import { Event } from "./types";

export interface IGameStatePlayer {
  playerId: string;
  name: string;
  banker: boolean;
  balance: number;
}

export interface IGameState {
  players: IGameStatePlayer[];
  freeParkingBalance: number;
  open: boolean;
}

export const defaultGameState: IGameState = {
  players: [],
  freeParkingBalance: 0,
  open: true
};

const calculateState = (events: Event[], currentState: IGameState): IGameState => {
  return events.reduce((state: IGameState, event: Event) => {
    switch (event.type) {
      case "playerJoin":
        return {
          ...state,
          players: [
            ...state.players,
            {
              playerId: event.playerId,
              name: event.name,
              banker: false,
              balance: 0
            }
          ]
        };

      case "playerDelete":
        return {
          ...state,
          players: state.players.filter((p) => p.playerId !== event.playerId)
        };

      case "playerNameChange":
        return {
          ...state,
          players: state.players.map((p) =>
            p.playerId === event.playerId
              ? {
                  ...p,
                  name: event.name
                }
              : p
          )
        };

      case "playerBankerStatusChange":
        return {
          ...state,
          players: state.players.map((p) =>
            p.playerId === event.playerId
              ? {
                  ...p,
                  banker: event.isBanker
                }
              : p
          )
        };

      case "transaction":
        const sourcePlayer = state.players.find((p) => p.playerId === event.from);
        const destinationPlayer = state.players.find((p) => p.playerId === event.to);
        return {
          ...state,
          players: [
            ...state.players.filter((p) => p.playerId !== event.from && p.playerId !== event.to),
            {
              ...sourcePlayer,
              balance: sourcePlayer.balance - event.amount
            },
            {
              ...destinationPlayer,
              balance: destinationPlayer.balance + event.amount
            }
          ]
        };

      case "gameOpenStateChange":
        return {
          ...state,
          open: event.open
        };
    }
  }, currentState);
};

export default calculateState;
