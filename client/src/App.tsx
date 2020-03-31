import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import { IGameState } from "./types";
import MetaTags from "./components/MetaTags";
import PageSizeWrapper from "./components/PageSizeWrapper";
import Home from "./pages/Home";
import { useRoutes, navigate } from "hookrouter";
import NotFound from "./pages/NotFound";
import Config from "./config";
import Funds from "./pages/Funds";
import Bank from "./pages/Bank";
import Transactions from "./pages/Transactions";
import Game from "./pages/Game";
import Join from "./pages/Join";

// TODO If we go to /, /join, /new-game then remove the current game but store the userId incase they join again

const wrapRoute = (route: string, child: JSX.Element) => (
  <MetaTags route={route} description={Config.routeDescriptions[route]}>
    <PageSizeWrapper>{child}</PageSizeWrapper>
  </MetaTags>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<IGameState | null>(null);

  const inGame = gameState !== null;
  const isBanker = gameState !== null && gameState.isBanker;

  const onGameSetup = (gameId: string, userId: string) => {
    // TODO Save current for potential later use?
    setGameState({
      gameId,
      userId,
      events: [],
      isBanker: false
    });
    navigate("/funds");
  };

  const routes = {
    "/": () => wrapRoute("/", <Home />),
    "/join": () => wrapRoute("/join", <Join newGame={false} onGameSetup={onGameSetup} />),
    "/new-game": () => wrapRoute("/new-game", <Join newGame={true} onGameSetup={onGameSetup} />),
    "/funds": inGame ? () => wrapRoute("/funds", <Funds />) : () => <NotFound />,
    "/bank": inGame && isBanker ? () => wrapRoute("/bank", <Bank />) : () => <NotFound />,
    "/transactions": inGame
      ? () => wrapRoute("/transactions", <Transactions />)
      : () => <NotFound />,
    "/game": inGame && isBanker ? () => wrapRoute("/game", <Game />) : () => <NotFound />
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
