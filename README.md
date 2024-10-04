<div style="text-align: center">
    <a href="https://monopoly-money.nitratine.net/"><img src="./packages/client/src/img/banner.png" alt="Monopoly Money Banner" style="background: white;"></a>
</div>
<p align="center">Manage your finances in a game of Monopoly from the browser.</p>
<p align="center"><a href="https://monopoly-money.nitratine.net/">🌐: monopoly-money.nitratine.net</a></p>

## Screenshots

| <!-- -->                                                                                                                                               | <!-- -->                                                                                                                                          | <!-- -->                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Funds page with game id](https://nitratine.net/posts/monopoly-money/screenshot-1.png)](https://nitratine.net/posts/monopoly-money/screenshot-1.png) | [![Transferring funds](https://nitratine.net/posts/monopoly-money/screenshot-2.png)](https://nitratine.net/posts/monopoly-money/screenshot-2.png) | [![Game history](https://nitratine.net/posts/monopoly-money/screenshot-3.png)](https://nitratine.net/posts/monopoly-money/screenshot-3.png)                                             |
| [![Bankers actions page](https://nitratine.net/posts/monopoly-money/screenshot-4.png)](https://nitratine.net/posts/monopoly-money/screenshot-4.png)    | [![Game settings](https://nitratine.net/posts/monopoly-money/screenshot-5.png)](https://nitratine.net/posts/monopoly-money/screenshot-5.png)      | [![A game closed to new players and a transaction just made](https://nitratine.net/posts/monopoly-money/screenshot-6.png)](https://nitratine.net/posts/monopoly-money/screenshot-6.png) |

## 📝 Features

- Multiple games can be hosted on the server at once
- Each player uses their own device; everyone joins one game
- Send money between players with ease - no need to sort out change
- Realtime - players get notified when an event occurs immediately.
- The person that created the game is the banker. This person can:
  - Give money to players from the bank (and take money)
  - Give free parking to players
  - Update player names
  - Remove players
  - Toggle whether free parking can be used or not
  - Stop new people from joining the game
  - End the game completely
- History is recorded of each game event that can be viewed by all players

## 🛠️ Setup

1. Clone the repo and cd into the project.
2. Install dependencies by executing `npm install`.
3. Setup environment variables. Either:
   - Set the environment variables in the current terminal session
   - Copy the .env.example files in the server and client packages and populate them:
     - `cp packages/server/.env.example packages/server/.env`
     - `cp packages/client/.env.example packages/client/.env`
4. Build dependencies using `npm run build`.
5. Execute `npm start` to start the server.

### 🧪 Development Setup

To setup hot reloading on the backend and frontend:

- Run the backend using `npm run server:dev`
- Run the frontend using `npm run client:dev`

> `launch.json` also offers the ability to connect and debug the the server when running `npm run client:dev`.

This project uses npm workspaces. Here are some example commands on how to get stuff done:

- Add a dependency to the client: `npm install DEP -w ./packages/client --save`
- Build just the client: `npm run build -w ./packages/client`

## ❓ Why?

If you have ever played the credit card edition of Monopoly, you will appreciate how much faster the game moves without having to count cash. This webapp substitutes the need for cash in a game of monopoly for a mobile-banking-like solution where players can easily send each other virtual currency.

## 🌐 Deployment

This application was designed to have the server deployed on fly.io (with the client) and a separate (main) client on GitHub Pages.

- The server deployment workflow can be found in [deploy-server.yml](./.github/workflows/deploy-server.yml).
- The client deployment workflow can be found in [deploy-client.yml](./.github/workflows/deploy-client.yml).
