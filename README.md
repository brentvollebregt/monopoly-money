<div style="text-align: center">
    <a href="https://monopoly-money.nitratine.net/"><img src="./client/src/img/banner.png" alt="Monopoly Money Banner" style="background: white;"></a>
</div>
<p align="center">Manage your finances in a game of monopoly from the browser.</p>
<p align="center"><a href="https://monopoly-money.nitratine.net/">🌐: monopoly-money.nitratine.net</a></p>

## 🛠️ Setup

1. Clone the repo.
2. Setup the server
   - Execute `npm install` to install dependencies
   - Execute `cp .env.example .env` (or `copy` for Windows) and populate `.env` by replacing XXXXXX's
3. Setup the client
   - `cd client` to change directories to the client project
   - Execute `npm install` to install dependencies
   - Execute `cp .env.example .env` (or `copy` for Windows)
   - Execute `npm run build` to build the client (the server will host these built files)
   - Go back to the project root: `cd ..`
4. Execute `npm start` to start the server

### 🧪 Development Setup

When running the client in development mode using `npm start`, the client will use the `REACT_APP_API_ROOT` environment variable value to decide where to send requests. If this is not provided, the current hosted URL will be used.

`npm run dev` can also be used for development of the server; this allows for hot-reloading. Running the client using `npm start` and setting `REACT_APP_API_ROOT` to where the server is running will allow for a development setup with hot-reloading.

> `launch.json` also offers the ability to connect and debug the the server when running `npm run dev`.

## 📝 Features

_TODO_

## ❓ Why?

_TODO_

## 🚧 TODO

_TODO_

- Who is on my network page wrapper
- Frontend auto approve

### First Page Actions

- New game
- Join game
- Resume game (might still be on the server)
  - Request for games the device has known about
  - In local storage
- Restore game
  - - delete saved game

### Pages

- Funds
  - View everyone's balances
  - Pay to other players
  - Pay to free parking
  - Pay to bank
- Bank
  - Bankers tools (only visible by bankers)
  - Give / take money from players
  - Move money between players (banker forced)
  - Pay out free parking
- History
  - Visual logs of events
- Game
  - Game settings (only visible by admins)
  - Warning: If everyone leaves, there is a chance the game could be deleted
  - Make someone else banker / admin
  - Remove someone as banker / admin
  - Lock/Unlock people able to join
  - Remove people
  - Modify names
  - Save game (to restore later)
  - Warning: If everyone leaves, there is a chance the game could be deleted
  - Use this to restore later
  - Delete game

### Commands To (for API)

#### REST

- Create new game
  - POST /api/game
  - Provide: name
  - Returns: gameId, userId
- Join game (or try to)
  - POST /api/game/:gameId/join
  - Provide: name, gameId
  - Returns:
    - Success: userId
    - Failed: 404
- Check if a game still exists
  - GET /api/game/:gameId
  - Provide: gameId, userId
  - Returns:
    - Success: Created time / players + totals
    - Failed: 404
- Restore game
  - POST /api/restore-game
  - Provide: whole game
  - Returns: gameId

#### WS

- Create an event

### Commands From (for API)

- Events (as a stream)
  - Provide: gameId, userId
  - Returns: events
