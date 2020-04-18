<div style="text-align: center">
    <a href="https://monopoly-money.nitratine.net/"><img src="./client/src/img/banner.png" alt="Monopoly Money Banner" style="background: white;"></a>
</div>
<p align="center">Manage your finances in a game of Monopoly from the browser.</p>
<p align="center"><a href="https://monopoly-money.nitratine.net/">🌐: monopoly-money.nitratine.net</a></p>

## 🛠️ Setup

1. Clone the repo and cd into the project.
2. Install dependencies by executing `npm install`.
3. Setup environment variables. This can be done two ways:
   - Set the environment variables in the current terminal session
   - Copy the .env.example files in the server and client packages and populate them:
     - Examples are at: `packages/server/.env.example` and `packages/client/.env.example`
     - Copy these using `cp .env.example .env` and populate them both.
4. Build dependencies using `npm run build`.
5. Execute `npm start` to start the server

The environment variables that can be used are (can also be found in .env.example files):

- `REACT_APP_API_ROOT` (optional): The route that the client requests. Not setting this will default to `window.location.origin`.
- `SERVER_ALLOWED_ORIGINS` (optional): The origins that are served by the server. Not setting this is the equivalent of setting CORS to \*.

### 🧪 Development Setup

When running the client in development mode using `npm run client:dev`, the client will use the `REACT_APP_API_ROOT` environment variable value to decide where to send requests. If this is not provided, the current hosted URL will be used.

`npm run server:dev` can also be used for development of the server; this allows for hot-reloading. Running the client using `npm run client:dev` and setting `REACT_APP_API_ROOT` to where the server is running will allow for a development setup with hot-reloading.

> `launch.json` also offers the ability to connect and debug the the server when running `npm run client:dev`.

## 📝 Features

- Multiple games can be hosted on the server at once
- Each player uses their own device; everyone joins one game.
- Send money between players quickly
- The person that created the game is the banker. This person can:
  - Give money to players from the bank (and take money)
  - Give free parking to players
  - Update player names
  - Delete players
  - Stop new people from joining the game
  - End the game completely
- History is recorded of each game event that can be viewed by all players

## ❓ Why?

If you have every played the credit card edition of Monopoly, you will appreciate how much faster the game moves without having to count cash. This webapp substitutes the need for cash in a game of monopoly for a mobile-banking-like solution where players can easily send each other virtual currency.

## 🚧 TODO

The base of this application is completed, there are just a few more cosmetic goals I'm aiming for:

- Put \$ in send money modal
- M/K formatting and inputs
- `1fr 1fr` cols on home screen for larger devices
- Home text + images
- Help button
  - Small tutorial with GIFs
  - Layout: Title, description, GIF (repeat)
