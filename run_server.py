from flask import Flask, request, render_template, make_response, redirect, url_for, session, abort, send_from_directory
import os
import json
import socket
import logging
import datetime
import hashlib
import random


# Base definitions
def loadData():
    try:
        with open("data.json", 'r') as data_file:
            data = json.load(data_file)
    except FileNotFoundError:
        print ("Cannot find data.json; creating a default")
        data = {
            "site_variables" : {
                "ip" : socket.gethostbyname(socket.gethostname()),
                "port" : 8080,
                "secret_key" : 'TT&,dy~49H`y)w}"Z0USRhZ(a$u0@hYK1Tvi41!LQ_Iz|6dnvpjpVI-4Ru"`P?=G'
            },
            "debug": {
                "logging" : True,
                "cookie_expiration_days" : 356
            },
            "users" : {},
            "games" : {},
            "paused_games" : {}
        }
        saveData(data)
    return data

def saveData(data):
    with open('data.json', 'w') as outfile:
        json.dump(data, outfile, indent=4, sort_keys=True)

def createUserHash(name):
    hashed = hashlib.sha224((name + str(random.randint(1, 1000000000000000000))).encode('utf-8')).hexdigest()
    while True:
        if hashed in data['users']:
            hashed = hashlib.sha224((hashed + str(random.randint(1, 1000000000000000000))).encode('utf-8')).hexdigest()
        else:
            break
    return hashed

def verifyUser(request):
    pass

def createGame(banker):
    game_pin = str(random.randint(1, 1000000))
    while True:
        if game_data in data["games"]:
            game_pin = str(random.randint(1, 1000000))
        else:
            break

    data["games"][game_pin] = {
        "users" : {},
        "banker" : banker,
        "open" : True
    }

    return game_pin

def checkUserPlacement(request): # TODO In development
    if 'id' in request.cookies:
        if data['users'][request.cookies['id']]['game'] is None:
            # No game pin
            # TODO pin
            pass
        else:
            if data['users'][request.cookies['id']]['type'] == "player":
                # player
                if request.path == "/play/":
                    return [True]
                else:
                    return [False, redirect(url_for('play_page'))]
            else:
                # banker
                pass
    else:
        # No cookie
        if request.path == "/":
            return [True]
        else:
            return [False, redirect(url_for('home_page'))]

# Server setup
data = loadData()
game_data = {} # game_id : { players : { }, running : False, banker : "" }
app = Flask(__name__, static_url_path='')
app.secret_key = data['site_variables']['secret_key'] if 'secret_key' in data['site_variables'] else 'secretkey1568486123168'

@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


# App routes
@app.route("/", methods = ['POST', 'GET'])
def home_page():
    if request.method == 'GET':
        return render_template('home.html')
    else:
        name = request.form['name']
        if "player" in request.form:
            player_type = "player"
            response = make_response(redirect(url_for('pin_page')))
        elif "banker" in request.form:
            player_type = "banker"
            response = make_response(redirect(url_for('bank_page')))

        userHash = createUserHash(name)
        data['users'][userHash] = {
            "name" : name,
            "type" : player_type,
            "game" : None
        }

        if player_type == 'banker':
            data['users'][userHash]["game"] = createGame(userHash)

        response = make_response(redirect(url_for('pin_page')))
        response.set_cookie('id',
                            userHash,
                            expires=datetime.datetime.now() + datetime.timedelta(days=data["debug"]["cookie_expiration_days"]))
        return response

@app.route("/pin/")
def pin_page():
    # TODO Enter pin of game wanting to join
    return render_template('pin.html')

@app.route("/play/")
def play_page():
    # TODO Display items
    # TODO Don't allow actions until game has started
    # TODO Option to leave game (if they come back they will be sent back here as their cookie is still active)
    return render_template('play.html')

@app.route("/bank/")
def bank_page():
    # TODO Button to go back
    # TODO Can restart saved game
    # TODO Manage everyones balance
    # TODO Past go
    # TODO Edit names
    # TODO Jail
    # TODO Free parking
    # TODO Option to end game (if they come back they will be lead back to their play)
    return render_template('bank.html')

@app.errorhandler(404)
def page_not_found(error):
    return redirect(url_for('home_page'))

@app.route("/admin/")
def admin_page():
    # TODO Mange running games
    # TODO Manipulate data
    # TODO Statistics (money flow and other cool stuff)
    return "Not Implemented"

@app.route("/clear/")
def clear():
    response = make_response(redirect(url_for('home_page')))
    response.set_cookie('id', '', expires=0)
    return response


# Start Server
if __name__ == '__main__':
    ip = data['site_variables']['ip'] if 'ip' in data['site_variables'] else socket.gethostbyname(socket.gethostname())
    port = data['site_variables']['port'] if 'port' in data['site_variables'] else 8080
    print ("Site starting on http://" + ip + ":" + str(port))
    app.run(debug=True, host=ip, port=port)