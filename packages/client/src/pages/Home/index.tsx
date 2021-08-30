import React from "react";
import bannerImage from "../../img/banner.png";
import { Button, Card, Badge } from "react-bootstrap";
import { navigate } from "hookrouter";
import useStoredGames from "../../hooks/useStoredGames";
import "./Home.scss";
import { DateTime } from "luxon";
import { formatCurrency } from "../../utils";
import Screenshot1Image from "../../img/screenshots/screenshot-1.png";
import Screenshot2Image from "../../img/screenshots/screenshot-2.png";
import Screenshot3Image from "../../img/screenshots/screenshot-3.png";
import Screenshot4Image from "../../img/screenshots/screenshot-4.png";

interface IHomeProps {
  onGameSetup: (gameId: string, userToken: string, playerId: string) => void;
}

const Home: React.FC<IHomeProps> = ({ onGameSetup }) => {
  const { storedGames } = useStoredGames();

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
          <div className="active-game-cards">
            {storedGames
              .sort((a, b) => (a.time > b.time ? -1 : 1))
              .map(({ gameId, userToken, playerId, status, time }) => (
                <Card key={gameId} className="mb-1">
                  <Card.Body className="p-2">
                    <div className="text-left">
                      Game {gameId}
                      <small style={{ float: "right" }}>
                        {DateTime.fromISO(time).toFormat("DD h:mm a")}
                      </small>
                    </div>
                    <div>
                      {status?.players
                        .sort((p1, p2) => (p1.playerId === playerId ? -1 : 0))
                        .map((player) => (
                          <Badge
                            key={player.playerId}
                            variant={
                              player.playerId === playerId
                                ? "dark"
                                : player.banker
                                ? "info"
                                : "success"
                            }
                            className="mr-1"
                          >
                            {player.name}: {formatCurrency(player.balance)}
                          </Badge>
                        ))}
                      {status !== null && status.useFreeParking && (
                        <Badge variant="warning">
                          Free Parking: {formatCurrency(status.freeParkingBalance)}
                        </Badge>
                      )}
                    </div>
                    <Button
                      block
                      size="sm"
                      variant="outline-primary"
                      onClick={() => onGameSetup(gameId, userToken, playerId)}
                      className="mt-2"
                    >
                      Join Game
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </div>
        ) : (
          <div>You have no active games</div>
        )}
      </div>

      <hr />

      <div>
        <h2>What is Monopoly Money?</h2>
        <p>
          Monopoly Money is a webapp that helps you keep track of your finances in a game of
          Monopoly (or any game that uses currency).
        </p>
        <p>
          Instead of using the cash that the game commonly comes with, you can play Monopoly like
          you're playing the credit card edition, but with your phone - a much more faster way to
          exchange money.
        </p>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gridGap: 6 }}
          className="mt-5"
        >
          <img src={Screenshot1Image} alt="Funds page with game id" className="w-100" />
          <img src={Screenshot2Image} alt="Transfering funds" className="w-100" />
          <img src={Screenshot3Image} alt="Game history" className="w-100" />
          <img src={Screenshot4Image} alt="Bankers actions page" className="w-100" />
        </div>
      </div>
    </div>
  );
};

export default Home;
