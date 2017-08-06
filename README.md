# monopoly-money
A simple flask server that allows for a banker and multiple players

## Screenshots
![Player Type and Name Select](http://i.imgur.com/0zerq2pm.png "Player Type and Name Select")
![Player Game Select](http://i.imgur.com/LYiuJWym.png "Player Game Select")
![Player View](http://i.imgur.com/ECPmDU3m.png "Player View")
![Banker View](http://i.imgur.com/h1cJ5X2m.png "Banker View")

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

## Features
* Games that generate when a player makes themself a banker
* Easily join a game using a pin
* Transfer money easily
* Auto refresh in the background (still manual button in /play/ if its too slow)
* Banker can edit player names and remove people
* Free parking
* Ask who starts first (random selection of current players)
* Log that says what has happened (Shows all money values in K)
* Can set players balances
* Lock the game so no one else can come in while you are in the middle of a game

## Sources
* [material.io](material.io) for bank.png, play.png, close.png and edit.png
* [http://www.iconarchive.com](http://www.iconarchive.com) for favicon
