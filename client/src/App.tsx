import React, { useState } from "react";
import Navigation from "./components/Navigation";
import { GameState } from "./types";
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

const wrapRoute = (route: string, child: JSX.Element) => (
  <MetaTags route={route} description={Config.routeDescriptions[route]}>
    <PageSizeWrapper>{child}</PageSizeWrapper>
  </MetaTags>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState(GameState.NOT_IN_GAME);
  const [isBanker, setIsBanker] = useState(false);

  const inGame = gameState === GameState.IN_GAME;

  const goToGame = () => {};

  const routes = {
    "/": () => wrapRoute("/", <Home />),
    "/join": () => wrapRoute("/join", <Join newGame={false} />),
    "/new-game": () => wrapRoute("/new-game", <Join newGame={true} />),
    "/funds": inGame ? () => wrapRoute("/", <Funds />) : () => <NotFound />,
    "/bank": inGame && isBanker ? () => wrapRoute("/", <Bank />) : () => <NotFound />,
    "/transactions": inGame ? () => wrapRoute("/", <Transactions />) : () => <NotFound />,
    "/game": inGame && isBanker ? () => wrapRoute("/", <Game />) : () => <NotFound />
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
