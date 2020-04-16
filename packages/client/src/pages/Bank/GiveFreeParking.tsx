import React, { useState } from "react";
import { InputGroup, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { IGameStatePlayer } from "@monopoly-money/game-state";

interface IGiveFreeParkingProps {
  players: IGameStatePlayer[];
  freeParkingBalance: number;
  onSubmit: (playerId: string) => void;
}

const GiveFreeParking: React.FC<IGiveFreeParkingProps> = ({
  players,
  freeParkingBalance,
  onSubmit
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<IGameStatePlayer | null>(null);

  const valid = selectedPlayer !== null;

  const submit = () => {
    if (selectedPlayer !== null) {
      onSubmit(selectedPlayer.playerId);
      setSelectedPlayer(null);
    }
  };

  return (
    <>
      <label htmlFor={`free-parking-player`}>Give Free Parking (${freeParkingBalance})</label>
      <InputGroup>
        <DropdownButton
          as={InputGroup.Prepend}
          variant="outline-secondary"
          id={`free-parking-player`}
          title={selectedPlayer?.name ?? "Select Player"}
        >
          {players.map((player) => (
            <Dropdown.Item key={player.playerId} onClick={() => setSelectedPlayer(player)}>
              {player.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={submit} disabled={!valid}>
            Give
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </>
  );
};

export default GiveFreeParking;
