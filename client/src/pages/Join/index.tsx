import React from "react";

interface IJoinProps {
  newGame: boolean;
}

const Join: React.FC<IJoinProps> = ({ newGame }) => {
  return <div>{newGame ? "new" : "join"}</div>;
};

export default Join;
