import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import { IGameState } from "./types";
import MetaTags from "./components/MetaTags";
import PageSizeWrapper from "./components/PageSizeWrapper";
import Home from "./pages/Home";
import { useRoutes, navigate, usePath } from "hookrouter";
import NotFound from "./pages/NotFound";
import Funds from "./pages/Funds";
import Bank from "./pages/Bank";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Join from "./pages/Join";
import config from "./config";
import { routePaths } from "./constants";

const wrapRoute = (route: string, child: JSX.Element) => (
  <MetaTags route={route} description={config.routeDescriptions[route]}>
    <PageSizeWrapper>{child}</PageSizeWrapper>
  </MetaTags>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<IGameState | null>(null);

  const path = usePath();

  const inGame = true;
  const isBanker = true;
  // const inGame = gameState !== null;
  // const isBanker = gameState !== null && gameState.isBanker;

  // If the user has gone to a non-game route, clear the game state
  useEffect(() => {
    if (path === routePaths.home || path === routePaths.join || path === routePaths.newGame) {
      // TODO Save game state for later so they can join again (use these to display the tiles for past/current games)
      setGameState(null);
    }
  }, [path]);

  const onGameSetup = (gameId: string, userId: string) => {
    // TODO Save current for potential later use?
    // Setup our game state
    setGameState({
      gameId,
      userId,
      events: [],
      isBanker: false
    });

    // TODO Store the new gameId and userId incase the user leaves and comes back (do not restore, just give the option to join again)

    // Go to the funds page
    navigate("/funds");

    // Create the websocket connection
    // TODO
  };

  const routes = {
    [routePaths.home]: () => wrapRoute(routePaths.home, <Home />),
    [routePaths.join]: () =>
      wrapRoute(routePaths.join, <Join newGame={false} onGameSetup={onGameSetup} />),
    [routePaths.newGame]: () =>
      wrapRoute(routePaths.newGame, <Join newGame={true} onGameSetup={onGameSetup} />),
    [routePaths.funds]: inGame ? () => wrapRoute(routePaths.funds, <Funds />) : () => <NotFound />,
    [routePaths.bank]:
      inGame && isBanker ? () => wrapRoute(routePaths.bank, <Bank />) : () => <NotFound />,
    [routePaths.history]: inGame
      ? () => wrapRoute(routePaths.history, <History />)
      : () => <NotFound />,
    [routePaths.settings]:
      inGame && isBanker ? () => wrapRoute(routePaths.settings, <Settings />) : () => <NotFound />
  };

  const routeResult = useRoutes(routes);

  return (
    <>
      <Navigation inGame={inGame} isBanker={isBanker} />
      <div className="my-3">{routeResult || <NotFound />}</div>
    </>
  );
};

export default App;
