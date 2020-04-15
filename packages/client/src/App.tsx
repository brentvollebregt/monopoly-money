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
import useStoredGames from "./hooks/useStoredGames";
import useGameHandler, { IGameHandlerAuthInfo } from "./hooks/useGameHandler";

const wrapRoute = (route: string, child: JSX.Element) => (
  <MetaTags route={route}>
    <PageSizeWrapper>{child}</PageSizeWrapper>
  </MetaTags>
);

const App: React.FC = () => {
  const { storeGame } = useStoredGames();
  const [gameHandlerAuthInfo, setGameHandlerAuthInfo] = useState<IGameHandlerAuthInfo | null>(null);
  const gameState = useGameHandler(gameHandlerAuthInfo);
  const path = usePath();

  // If the user has gone to a non-game route, clear the game state
  useEffect(() => {
    if (path === routePaths.home || path === routePaths.join || path === routePaths.newGame) {
      onGameDestroy();
    }
  }, [path]);

  // Go to the funds page after a game has been setup
  useEffect(() => {
    if (
      gameState !== null &&
      (path === routePaths.home || path === routePaths.join || path === routePaths.newGame)
    ) {
      navigate("/funds");
    }
  }, [gameState]);

  const onGameSetup = (gameId: string, userToken: string, playerId: string) => {
    // Save current game for potential later use
    if (gameHandlerAuthInfo !== null) {
      storeGame(
        gameHandlerAuthInfo.gameId,
        gameHandlerAuthInfo.userToken,
        gameHandlerAuthInfo.playerId
      );
    }

    // Setup a new game handler by setting up auth
    setGameHandlerAuthInfo({ gameId, userToken, playerId });

    // Store new game details
    storeGame(gameId, userToken, playerId);
  };

  const onGameDestroy = () => {
    if (gameHandlerAuthInfo !== null) {
      storeGame(
        gameHandlerAuthInfo.gameId,
        gameHandlerAuthInfo.userToken,
        gameHandlerAuthInfo.playerId
      );
    }
    setGameHandlerAuthInfo(null);
  };

  const routes = {
    [routePaths.home]: () => wrapRoute(routePaths.home, <Home onGameSetup={onGameSetup} />),
    [routePaths.join]: () =>
      wrapRoute(routePaths.join, <Join newGame={false} onGameSetup={onGameSetup} />),
    [routePaths.newGame]: () =>
      wrapRoute(routePaths.newGame, <Join newGame={true} onGameSetup={onGameSetup} />),
    [routePaths.funds]:
      gameState !== null
        ? () =>
            wrapRoute(
              routePaths.funds,
              <Funds
                gameId={gameState.gameId}
                playerId={gameState.playerId}
                isGameOpen={gameState.open}
                players={gameState.players}
                freeParkingBalance={gameState.freeParkingBalance}
                proposeTransaction={gameState.actions.proposeTransaction}
              />
            )
        : () => <NotFound />,
    [routePaths.bank]:
      gameState !== null && gameState.isBanker
        ? () =>
            wrapRoute(
              routePaths.bank,
              <Bank
                players={gameState.players}
                proposeTransaction={gameState.actions.proposeTransaction}
              />
            )
        : () => <NotFound />,
    [routePaths.history]:
      gameState !== null
        ? () => wrapRoute(routePaths.history, <History events={gameState.events} />)
        : () => <NotFound />,
    [routePaths.settings]:
      gameState !== null && gameState.isBanker
        ? () => wrapRoute(routePaths.settings, <Settings />)
        : () => <NotFound />
  };

  const routeResult = useRoutes(routes);

  return (
    <>
      <Navigation inGame={gameState !== null} isBanker={gameState?.isBanker ?? false} />
      <div className="my-3">{routeResult || <NotFound />}</div>
    </>
  );
};

export default App;
