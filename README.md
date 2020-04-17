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

handle socket closed?

- Handle a player being removed
- Toasts on failures ( cogo-toast when a player is removed from a game )
- Close ws when going home
- Socket addEventListener
- Put \$ in send money modal
- Help button
  - Small tutorial with GIFs
  - Layout: Title, description, GIF (repeat)

## Bugs 🐞

- When clicking the logo to go home when you're in a game, you will go / => /funds => /
