import React from "react";
import bannerImage from "../../img/banner.png";
import { Button } from "react-bootstrap";
import { navigate, useTitle } from "hookrouter";
import "./Home.scss";

const Home: React.FC = () => {
  useTitle("Monopoly Money");

  const newGame = () => navigate("/new-game");
  const joinGame = () => navigate("/join");

  return (
    <div className="home text-center">
      <h1 className="sr-only">Monopoly Money</h1>
      <img src={bannerImage} className="banner" alt="Monopoly Money Banner" />

      <p className="lead mt-2">
        An easy way to manage finances in your game of monopoly from the browser.
      </p>

      <div className="new-join-button-wrapper mt-4">
        <Button size="lg" onClick={newGame}>
          New Game
        </Button>
        <Button size="lg" onClick={joinGame}>
          Join Game
        </Button>
      </div>

      <div className="mt-4">
        <h2>Your Active Games</h2>
        {/* TODO */}
      </div>

      <div>
        <h2>Restore A Game</h2>
        {/* TODO */}
      </div>

      <div>
        <h2>What is Monopoly Money?</h2>
        {/* TODO */}
      </div>

      <div>
        <h2>How it Works</h2>
        {/* TODO */}
      </div>
    </div>
  );
};

export default Home;
