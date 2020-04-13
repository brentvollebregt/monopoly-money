import setupWebsocketAPI from "./ws";
import GameRoutes, { subRoute as gameSubRoute } from "./http/game";
import RestoreRoutes, { subRoute as restoreSubRoute } from "./http/restore";

export { setupWebsocketAPI, GameRoutes, gameSubRoute, RestoreRoutes, restoreSubRoute };
