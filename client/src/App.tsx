import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
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
import { routePaths } from "./constants";
import GameHandler from "./logic/GameHandler";
import useStoredGames from "./hooks/useStoredGames";

const wrapRoute = (route: string, child: JSX.Element) => (
  <MetaTags route={route}>
    <PageSizeWrapper>{child}</PageSizeWrapper>
  </MetaTags>
);

const App: React.FC = () => {
  const [gameHandler, setGameHandler] = useState<GameHandler | null>(null);
  const { storedGames, storeGame } = useStoredGames();

  const path = usePath();

  const inGame = gameHandler !== null;
  const isBanker = gameHandler !== null && gameHandler.isBanker;

  // If the user has gone to a non-game route, clear the game state
  useEffect(() => {
    if (path === routePaths.home || path === routePaths.join || path === routePaths.newGame) {
      onGameDestroy();
    }
  }, [path]);

  const onGameSetup = (gameId: string, userToken: string) => {
    // Save current game for potential later use
    if (gameHandler !== null) {
      storeGame(gameHandler.gameId, gameHandler.userToken);
    }

    // Setup a new game handler
    setGameHandler(new GameHandler(gameId, userToken));

    // Store new game details
    storeGame(gameId, userToken);

    // Go to the funds page
    navigate("/funds");
  };

  const onGameDestroy = () => {
    if (gameHandler !== null) {
      storeGame(gameHandler.gameId, gameHandler.userToken);
    }
    setGameHandler(null);
  };

  const routes = {
    [routePaths.home]: () =>
      wrapRoute(routePaths.home, <Home storedGames={storedGames} onGameSetup={onGameSetup} />),
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
