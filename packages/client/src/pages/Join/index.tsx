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

  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");
  const [gameError, setGameError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useTitle(`${title} - Monopoly Money`);

  const onGameIdChange = (event: React.FormEvent<HTMLInputElement>) => {
    setGameId(event.currentTarget.value ?? "");
  };

  const onNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value || ""); // TODO Why can't I use??
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
      createGame(name)
        .then((result) => {
          onGameSetup(result.gameId, result.userToken, result.playerId);
        })
        .catch((error) => console.log(error));
    } else {
      // Validity check
      if (gameId === "") {
        setGameError("Please provide the game Id");
        return;
      }
      {
        setGameError(null);
      }
      if (name === "") {
        setNameError("Please provide your name");
        return;
      }
      setNameError(null);

      // Join game
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
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <h1>{title}</h1>

      {!newGame && (
        <Form.Group>
          <Form.Label>Game Id</Form.Label>
          <Form.Control placeholder="XXXXXX" value={gameId} onChange={onGameIdChange} />
          <Form.Text style={{ color: "var(--danger)" }}>{gameError}</Form.Text>
        </Form.Group>
      )}

      <Form.Group>
        <Form.Label>Your Name</Form.Label>
        <Form.Control placeholder="Name" value={name} onChange={onNameChange} />
        <Form.Text style={{ color: "var(--danger)" }}>{nameError}</Form.Text>
      </Form.Group>

      <Button block variant="primary" onClick={onSubmit}>
        {newGame ? "Create" : "Join"}
      </Button>
    </div>
  );
};

export default Join;
