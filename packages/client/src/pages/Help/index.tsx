import React from "react";
import PagesImage from "../../img/help/pages.png";
import "./Help.scss";

const Help: React.FC = () => {
  return (
    <div className="help">
      <h3 className="text-center">Monopoly Money Help</h3>
      <p className="lead mt-2 text-center">A small gide to Monopoly Money.</p>

      <ul>
        <li>
          <a href="#pages">Pages</a>
        </li>
        <li>
          <a href="#player-help">Player Help</a>
        </li>
        <li>
          <a href="#banker-help">Banker Help</a>
        </li>
      </ul>

      <h4 id="pages">Pages</h4>
      <img src={PagesImage} alt="Titles for each page" className="mw-100" />

      <h4 id="player-help">Player Help</h4>

      <h5>Joining a Game</h5>
      <p>
        To join a game, select "Join Game" from the home page and then enter the game id (the banker
        will have this) and your name. Press "Join" when you have filled out all the fields.
      </p>

      <h5>Transferring Funds to Other Players, Free Parking and the Bank</h5>
      <p>
        To transfer funds to another person/entity, click the tile associated with the target
        player/entity on the funds page. A dialog should appear which will allow you to input an
        amount to transfer. Press "Send" to complete the transaction.
      </p>

      <h5>Viewing Previous Transactions</h5>
      <p>
        Monopoly money allows you to view all events including transactions that have previously
        ocurred in the game. Go to the history page to view these events.
      </p>

      <h4 id="banker-help">Banker Help</h4>

      <h5>Creating a Game</h5>
      <p>
        To create a game, select "New Game" from the home page, enter your name (this will be your
        player name) and press "Create".
      </p>

      <h5>Initialising Player Balances</h5>
      <p>
        Initialising a game sets everyone's balance to an initial value in one action; this option
        is only available if no transaction has been made yet.
      </p>
      <p>
        Clicking the "Initialise Player Balances" button on the banker page, providing and amount
        and pressing "Initialise" will set all players balances to the provided value.{" "}
      </p>

      <h5>Giving Money to Players from the Bank</h5>
      <p>
        On the bank page under the "Give Money To Player" label is a form to give money to players.
        Provide the amount and then select a target player from the dropdown. Pressing send will
        complete the transaction.
      </p>

      <h5>Moving Money from Players from the Bank</h5>
      <p>
        You can also do the opposite of above using the form under "Take Money From Player"; move
        money from a player to the bank.
      </p>
      <p>
        This is typically not a required action but is provided in the case that the banker
        accidentally gives too much money to a player.
      </p>

      <h5>Players Passing GO</h5>
      <p>
        Instead of repeatedly inputting the passing GO reward, a dropdown is displayed on the bank
        page under the "Player Passed Go ($[amount])" header. Selecting a player and then pressing
        "Give" will give the player the amount displayed above.
      </p>
      <p>
        To change the amount given to a player, press the settings button to the right, input a new
        amount and press "Set".
      </p>

      <h5>Giving Free Parking to a Player</h5>
      <p>
        To give free parking to a player, select the player in the dropdown under the "Give Free
        Parking" label and press "Give" to complete the transaction.
      </p>

      <h5>Changing a Player's Name</h5>
      <p>
        You can change a players name on the settings page by clicking the pencil button in the same
        row as they target player. Modifying the name and clicking "Rename" will rename the player.
      </p>

      <h5>Removing a Player</h5>
      <p>
        You can remove a player from the game the settings page by clicking the trash button in the
        same row as they target player. Confirming this action will remove the player from the
        current game.
      </p>

      <h5>Closing the Game to New Players</h5>
      <p>
        Closing the game stops new players from joining and hides the game code from the funds page.
        To do this, select "Close Game To New Players" on the settings page. This is helpful if
        everyone has joined the game and you don't need anyone else to join.
      </p>
      <p>To re-open the game, press the same button again.</p>

      <h5>Ending the Game</h5>
      <p>
        You can end the game by clicking "End Game" on the setting page and confirming. This will
        fully delete the game and kick everyone. You cannot go back into a game after ending it.
      </p>
    </div>
  );
};

export default Help;
