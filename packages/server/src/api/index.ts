import GameRoutes, { subRoute as gameSubRoute } from "./http/game";
import RestoreRoutes, { subRoute as restoreSubRoute } from "./http/restore";
import setupWebsocketAPI from "./ws";

export { GameRoutes, gameSubRoute, RestoreRoutes, restoreSubRoute, setupWebsocketAPI };
