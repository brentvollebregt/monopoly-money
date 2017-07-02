from flask import Flask, request, render_template, make_response, redirect, url_for, session, abort, send_from_directory
import os
import json
import socket
import logging


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
                "logging" : True
            }
        }
        saveData(data)
    return data

def saveData(data):
    with open('data.json', 'w') as outfile:
        json.dump(data, outfile, indent=4, sort_keys=True)


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
@app.route("/")
def home_page():
    # TODO Get name
    # TODO Select whether player/banker
    # TODO Player goes to pin
    # TODO Banker goes to bank
    return render_template('home.html')

@app.route("/pin/")
def pin_page():
    # TODO Enter pin of game wanting to join
    return render_template('pin.html')

@app.route("/play/")
def play_page():
    # TODO Display items
    # TODO Don't allow actions until game has started
    return render_template('play.html')

@app.route("/bank/")
def bank_page():
    # TODO Button to go back
    # TODO Manage everyones balance
    # TODO Past go
    # TODO Edit names
    # TODO Jail
    # TODO Free parking
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


# Start Server
if __name__ == '__main__':
    ip = data['site_variables']['ip'] if 'ip' in data['site_variables'] else socket.gethostbyname(socket.gethostname())
    port = data['site_variables']['port'] if 'port' in data['site_variables'] else 8080
    print ("Site starting on http://" + ip + ":" + str(port))
    app.run(debug=True, host=ip, port=port)