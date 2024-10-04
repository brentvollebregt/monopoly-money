import { IGameStatePlayer } from "@monopoly-money/game-state";
import React, { useState } from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { formatCurrency } from "../../utils";

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
      <label htmlFor="free-parking-player" className="mb-1">
        Give Free Parking ({formatCurrency(freeParkingBalance)})
      </label>

      <ButtonGroup className="mt-1 player-and-submit-group">
        <DropdownButton
          as={ButtonGroup}
          variant="outline-secondary"
          id="free-parking-player"
          title={selectedPlayer?.name ?? "Select Player"}
        >
          {players.map((player) => (
            <Dropdown.Item key={player.playerId} onClick={() => setSelectedPlayer(player)}>
              {player.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <Button variant="outline-secondary" onClick={submit} disabled={!valid}>
          Give
        </Button>
      </ButtonGroup>
    </>
  );
};

export default GiveFreeParking;
