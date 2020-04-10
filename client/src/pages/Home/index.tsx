import React from "react";
import bannerImage from "../../img/banner.png";
import { Button, Card, Badge } from "react-bootstrap";
import { navigate, useTitle } from "hookrouter";
import { IStoredGame } from "../../hooks/useStoredGames";
import "./Home.scss";
import { DateTime } from "luxon";

interface IHomeProps {
  storedGames: IStoredGame[];
  onGameSetup: (gameId: string, userToken: string) => void;
}

const Home: React.FC<IHomeProps> = ({ storedGames, onGameSetup }) => {
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
        {storedGames.length > 0 ? (
          storedGames.map(({ gameId, userToken, status }) => (
            <Card key={gameId} className="mb-1">
              <Card.Body className="p-2">
                <div className="text-left">
                  Game {gameId}
                  <small style={{ float: "right" }}>
                    (
                    {status === null
                      ? ""
                      : DateTime.fromISO(status.createdTime).toFormat("DD h:mm a")}
                    )
                  </small>
                </div>
                <div>
                  {["Brent: $1000000", "Robert: $5550000", "Rob: $480000"].map((player) => (
                    <Badge key={player} variant="success" className="mr-1">
                      {player}
                    </Badge>
                  ))}
                </div>
                <Button
                  block
                  size="sm"
                  variant="outline-primary"
                  onClick={() => onGameSetup(gameId, userToken)}
                  className="mt-1"
                >
                  Join Game
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <>
            <div>You have no active games</div>
          </>
        )}
        {/* TODO */}
      </div>

      <hr />

      <div>
        <h2>What is Monopoly Money?</h2>
        {/* TODO */}
      </div>

      <hr />

      <div>
        <h2>How it Works</h2>
        {/* TODO */}
      </div>
    </div>
  );
};

export default Home;
