# monopoly-money
A simple flask server that allows for a banker and multiple players

## Screenshots
Will add some when more development is made

## Requirements
* Python 3.6 (basically anything that will run Flask)
* Flask (pip install Flask)

## Usage
1. Optional: delete data.json on first run or use the one supplied
2. Run run_server.py
3. Visit address displayed
4. Choose if you are the banker or another player and supply your name
5. If you are a player, enter the pin supplied by your banker
6. Have fun

## Development
Pretty much everything, but here is a checklist of what I want to add; will be removing them once they get old
 - [x] Banker/Player selection
 - [x] Host multiple games from server: banker creates new gave and gives token to new players (means this could be hosted somewhere)
 - [ ] Banker can switch to being a player with a button
 - [ ] Banker can remove people (only when unlocked)
 - [ ] History of transfers to banker
 - [ ] Private history of transfers between users
 - [ ] Can select whether to show balances to others
 - [ ] User to bank and bank to user history is public
 - [ ] Quick transaction buttons for banker
 - [ ] Game preset selections (start amount, what go gives you, get out of jail amount)(customise own)
 - [ ] Administration panel; look at current and saved games, delete games