import React from "react";

const Help: React.FC = () => {
  return (
    <div className="home">
      <h3 className="text-center">Monopoly Money Help</h3>
      <p className="lead mt-2 text-center">A small gide to Monopoly Money.</p>

      <ul>
        <li>
          <a>Player Help</a>
          <ul>
            <li>
              <a>Joining a Game</a>
              <a>Transferring Funds to Other Players and Free Parking</a>
              <a>Viewing Previous Transactions</a>
            </li>
          </ul>
        </li>
        <li>
          <a>Banker Help</a>
          <ul>
            <li>
              <a>Creating a Game</a>
            </li>
          </ul>
        </li>
      </ul>

      <h4>Player Help</h4>
      <h5>Joining a Game</h5>
      <h5>Transferring Funds to Other Players and Free Parking</h5>
      <h5>Viewing Previous Transactions</h5>

      <h4>Banker Help</h4>
      <h5>Creating a Game</h5>
    </div>
  );
};

export default Help;
