import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { createGame, joinGame } from "../../api";
import Config from "../../config";
import useStoredGames from "../../hooks/useStoredGames";
import { getGameIdFromQueryString, trackGameCreated, trackGameJoined } from "../../utils";

interface IJoinProps {
  newGame: boolean;
  onGameSetup: (gameId: string, userToken: string, playerId: string) => void;
}

const Join: React.FC<IJoinProps> = ({ newGame, onGameSetup }) => {
  const title = newGame ? "Create Game" : "Join Game";

  const { storedGames } = useStoredGames(false);
  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState(getGameIdFromQueryString() ?? "");
  const [name, setName] = useState("");
  const [gameError, setGameError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [hasServerError, setHasServerError] = useState(false);

  // If the game is already stored, join with what we have
  const isAStoredGame = storedGames.map((g) => g.gameId).indexOf(gameId) !== -1;

  const onSubmit = () => {
    if (isAStoredGame) {
      const storedGame = storedGames.find((g) => g.gameId === gameId)!;
      onGameSetup(storedGame.gameId, storedGame.userToken, storedGame.playerId);
    } else if (newGame) {
      // Validity check
      if (name === "") {
        setNameError("Please provide your name");
        return;
      }
      setNameError(null);

      // Create game
      setLoading(true);
      createGame(name)
        .then((result) => {
          onGameSetup(result.gameId, result.userToken, result.playerId);
          trackGameCreated();
        })
        .catch((error) => {
          console.log(error);
          setHasServerError(true);
        })
        .finally(() => setLoading(false));
    } else {
      // Validity check
      if (gameId === "") {
        setGameError("Please provide the game Id");
        return;
      }
      setGameError(null);
      if (name === "") {
        setNameError("Please provide your name");
        return;
      }
      setNameError(null);

      // Join game
      setLoading(true);
      joinGame(gameId, name)
        .then((result) => {
          if (result === "DoesNotExist") {
            setGameError("That game does not exist");
          } else if (result === "NotOpen") {
            setGameError("That game is not open. Ask the banker to open the game.");
          } else {
            onGameSetup(result.gameId, result.userToken, result.playerId);
            trackGameJoined();
          }
        })
        .catch((error) => {
          console.log(error);
          setHasServerError(true);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="text-center">
      <h1>{title}</h1>

      {!newGame && (
        <Form.Group>
          <Form.Label>Game Id</Form.Label>
          <NumberFormat
            allowNegative={false}
            format="######"
            placeholder="123456"
            value={gameId}
            onValueChange={({ value }: NumberFormatValues) => setGameId(value)}
            className="form-control text-center"
            autoComplete="off"
            inputMode="decimal"
          />
          <Form.Text style={{ color: "var(--danger)" }}>{gameError}</Form.Text>
        </Form.Group>
      )}

      {isAStoredGame ? (
        <p>
          <em>You're already in this game - name is not required.</em>
        </p>
      ) : (
        <Form.Group>
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            placeholder="Name"
            value={name}
            className="text-center"
            onChange={(e) => setName(e.currentTarget.value)}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
              event.key === "Enter" && onSubmit()
            }
            autoComplete="on"
          />
          <Form.Text style={{ color: "var(--danger)" }}>{nameError}</Form.Text>
        </Form.Group>
      )}

      <Button block variant="primary" onClick={onSubmit} disabled={loading}>
        {newGame ? "Create" : "Join"}
      </Button>

      {hasServerError && (
        <p style={{ color: "var(--danger)" }} className="mt-2">
          {Config.api.unreachableErrorMessage.split("\n").map((line, i, arr) => (
            <React.Fragment key={line}>
              {line}
              {i !== arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      )}
    </div>
  );
};

export default Join;
