import React, { useState } from "react";
import { useTitle } from "hookrouter";
import { Form, Button } from "react-bootstrap";
import { createGame, joinGame } from "../../api";

interface IJoinProps {
  newGame: boolean;
  onGameSetup: (gameId: string, userToken: string, playerId: string) => void;
}

const Join: React.FC<IJoinProps> = ({ newGame, onGameSetup }) => {
  const title = newGame ? "Create Game" : "Join Game";

  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");
  const [gameError, setGameError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useTitle(`${title} - Monopoly Money`);

  const onGameIdChange = (event: React.FormEvent<HTMLInputElement>) => {
    setGameId(event.currentTarget.value ?? "");
  };

  const onNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const onSubmit = () => {
    if (newGame) {
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
        })
        .catch((error) => console.log(error))
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
          }
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="text-center">
      <h1>{title}</h1>

      {!newGame && (
        <Form.Group>
          <Form.Label>Game Id</Form.Label>
          <Form.Control
            placeholder="123456"
            value={gameId}
            className="text-center"
            onChange={onGameIdChange}
          />
          <Form.Text style={{ color: "var(--danger)" }}>{gameError}</Form.Text>
        </Form.Group>
      )}

      <Form.Group>
        <Form.Label>Your Name</Form.Label>
        <Form.Control
          placeholder="Name"
          value={name}
          className="text-center"
          onChange={onNameChange}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
            event.key === "Enter" && onSubmit()
          }
        />
        <Form.Text style={{ color: "var(--danger)" }}>{nameError}</Form.Text>
      </Form.Group>

      <Button block variant="primary" onClick={onSubmit} disabled={loading}>
        {newGame ? "Create" : "Join"}
      </Button>
    </div>
  );
};

export default Join;
