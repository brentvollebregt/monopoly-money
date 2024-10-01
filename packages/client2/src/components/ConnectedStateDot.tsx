import React from "react";
import "./ConnectedStateDot.scss";

interface IConnectedStateDotProps {
  connected: boolean;
  className?: string;
}

const ConnectedStateDot: React.FC<IConnectedStateDotProps> = ({ connected, className = "" }) => {
  return <div className={`connected-state-dot ${connected ? "connected" : ""} ${className}`} />;
};

export default ConnectedStateDot;
