import { GameEvent, IGameState } from "./types";

export const defaultGameState: IGameState = {
  players: [],
  useFreeParking: true,
  freeParkingBalance: 0,
  open: true
};

export const calculateGameState = (events: GameEvent[], currentState: IGameState): IGameState => {
  return events.reduce((state: IGameState, event: GameEvent) => {
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
              balance: 0,
              connected: false
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
        if (event.from === "bank" || event.from === "freeParking") {
          const destinationPlayer = state.players.find((p) => p.playerId === event.to);
          if (destinationPlayer === undefined) {
            throw new Error("Unable to find destination player");
          }
          return {
            ...state,
            players: [
              ...state.players.filter((p) => p.playerId !== event.from && p.playerId !== event.to),
              {
                ...destinationPlayer,
                balance: destinationPlayer.balance + event.amount
              }
            ],
            freeParkingBalance:
              event.from === "freeParking"
                ? state.freeParkingBalance - event.amount
                : state.freeParkingBalance
          };
        } else if (event.to === "bank" || event.to === "freeParking") {
          const sourcePlayer = state.players.find((p) => p.playerId === event.from);
          if (sourcePlayer === undefined) {
            throw new Error("Unable to find source player");
          }
          return {
            ...state,
            players: [
              ...state.players.filter((p) => p.playerId !== event.from && p.playerId !== event.to),
              {
                ...sourcePlayer,
                balance: sourcePlayer.balance - event.amount
              }
            ],
            freeParkingBalance:
              event.to === "freeParking"
                ? state.freeParkingBalance + event.amount
                : state.freeParkingBalance
          };
        } else {
          const sourcePlayer = state.players.find((p) => p.playerId === event.from);
          const destinationPlayer = state.players.find((p) => p.playerId === event.to);
          if (sourcePlayer === undefined || destinationPlayer === undefined) {
            throw new Error("Unable to find source or destination player");
          }
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
        }
      case "gameOpenStateChange":
        return {
          ...state,
          open: event.open
        };

      case "useFreeParkingChange":
        return {
          ...state,
          useFreeParking: event.useFreeParking
        };

      case "playerConnectionChange":
        return {
          ...state,
          players: [
            ...state.players.filter((p) => p.playerId !== event.playerId),
            {
              ...state.players.find((p) => p.playerId === event.playerId)!,
              connected: event.connected
            }
          ]
        };
    }
  }, currentState);
};
