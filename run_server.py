from flask import Flask, request, render_template, make_response, redirect, url_for, session, abort, send_from_directory, jsonify
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
            "games" : {}
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

def createGame(banker):
    game_pin = str(random.randint(1, 1000000))
    while True:
        if game_pin in data["games"]:
            game_pin = str(random.randint(1, 1000000))
        else:
            break

    data["games"][game_pin] = {
        "players" : {
            data['users'][banker]['name'] : {
                "id" : banker,
                "bal" : 0,
                "name" : data['users'][banker]['name']
            }
        },
        "banker" : banker,
        "open" : True,
        "free_parking" : 0,
        "logs" : []
    }

    return game_pin

def checkUserPlacement(request):
    if 'id' in request.cookies:
        if request.cookies['id'] not in data['users']:
            # Fake or old cookie
            response = make_response(redirect(url_for('home_page')))
            response.set_cookie('id', '', expires=0)
            return [False, response]
        else:
            if data['users'][request.cookies['id']]['game'] is None:
                # No game pin
                if request.path == "/pin/":
                    return [True]
                else:
                    return [False, redirect(url_for('pin_page'))]
                pass
            else:
                if data['users'][request.cookies['id']]['game'] in data['games']:
                    # Game is running
                    if data['users'][request.cookies['id']]['type'] == "player":
                        # player
                        if request.path == "/play/":
                            return [True]
                        else:
                            return [False, redirect(url_for('play_page'))]
                    else:
                        # banker
                        if request.path == "/play/" or request.path == "/bank/":
                            return [True]
                        else:
                            return [False, redirect(url_for('play_page'))]
                else:
                    # Game is finished
                    session['message'] = ("Your game has been ended")
                    response = make_response(redirect(url_for('home_page')))
                    response.set_cookie('id', '', expires=0)
                    return [False, response]
    else:
        # No cookie
        if request.path == "/":
            return [True]
        else:
            return [False, redirect(url_for('home_page'))]


# Server setup
data = loadData()
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
        if checkUserPlacement(request)[0] == True:
            if 'message' in session:
                message = session['message']
                del session['message']
            else:
                message = None
            return render_template('home.html',
                                   message=message
                                   )
        else:
            return checkUserPlacement(request)[1]
    else:
        name = request.form['name']
        if name == "":
            return render_template('home.html', message="Please provide a name")
        if name in ["Bank", "Free Parking", "Player"]:
            return render_template('home.html', message="Invalid name")

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
            "game" : None,
        }

        if player_type == 'banker':
            data['users'][userHash]["game"] = createGame(userHash)

        response = make_response(redirect(url_for('pin_page')))
        response.set_cookie('id',
                            userHash,
                            expires=datetime.datetime.now() + datetime.timedelta(days=data["debug"]["cookie_expiration_days"]))
        return response

@app.route("/pin/", methods = ['POST', 'GET'])
def pin_page():
    if request.method == 'GET':
        if checkUserPlacement(request)[0] == True:
            return render_template('pin.html', name=data['users'][request.cookies['id']]['name'])
        else:
            return checkUserPlacement(request)[1]
    else:
        if request.form['pin'] in data['games']:
            if data['games'][request.form['pin']]['open']:
                if data['users'][request.cookies['id']]['name'] in data['games'][request.form['pin']]['players']:
                    return jsonify(response=5);
                data['users'][request.cookies['id']]['game'] = request.form['pin']
                data['games'][request.form['pin']]['players'][data['users'][request.cookies['id']]['name']] = {
                    "id" : request.cookies['id'],
                    "bal" : 0,
                    "name" : data['users'][request.cookies['id']]['name']
                }
                return jsonify(response=1);
            else:
                return jsonify(response=4)
        else:
            return jsonify(response=3)

@app.route("/play/", methods = ['POST', 'GET'])
def play_page():
    if request.method == 'GET':
        if checkUserPlacement(request)[0] == True:
            return render_template('play.html',
                                   name=data['users'][request.cookies['id']]['name'],
                                   type=data['users'][request.cookies['id']]['type'])
        else:
            return checkUserPlacement(request)[1]
    else:
        pass

@app.route("/bank/", methods = ['POST', 'GET'])
def bank_page():
    if request.method == 'GET':
        if checkUserPlacement(request)[0] == True:
            return render_template('bank.html', game_pin=data['users'][request.cookies['id']]['game'])
        else:
            return checkUserPlacement(request)[1]
    else:
        pass

@app.route("/admin/", methods = ['POST', 'GET'])
def admin_page():
    """
    Maybe:
    # TODO Mange running games
    # TODO Manipulate data
    # TODO Statistics (money flow and other cool stuff)
    """
    if request.method == 'GET':
        return "Not Implemented"
    else:
        pass

@app.errorhandler(404)
def page_not_found(error):
    return redirect(url_for('home_page'))


# Data Routes
@app.route("/clear/")
def clear_cookie():
    if 'id' in request.cookies:
        if request.cookies['id'] in data['users']:
            if data['users'][request.cookies['id']]['game'] != None:
                del data['games'][data['users'][request.cookies['id']]['game']]['players'][data['users'][request.cookies['id']]['name']]
            if data['users'][request.cookies['id']]['type'] == 'banker':
                del data['games'][data['users'][request.cookies['id']]['game']]
            del data['users'][request.cookies['id']]


    response = make_response(redirect(url_for('home_page')))
    response.set_cookie('id', '', expires=0)
    return response

@app.route("/play_data/")
def getPlayData():
    if request.cookies['id'] not in data['users']:
        return jsonify()
    if data['users'][request.cookies['id']]['game'] == None:
        return jsonify()

    game = data['users'][request.cookies['id']]['game']
    name = data['users'][request.cookies['id']]['name']

    balance = data['games'][game]['players'][name]['bal']
    users = [i for i in data['games'][game]['players']] + ["Bank", "Free Parking"]
    users.remove(name)
    free_parking = data['games'][game]['free_parking']
    logs = data['games'][game]['logs']

    return jsonify(balance=balance,
                   users=users,
                   free_parking=free_parking,
                   logs=logs)

@app.route("/bank_data/")
def getBankData():
    if request.cookies['id'] not in data['users']:
        return jsonify()
    if data['users'][request.cookies['id']]['game'] == None:
        return jsonify()

    game = data['users'][request.cookies['id']]['game']

    users = [i for i in data['games'][game]['players']]
    free_parking = data['games'][game]['free_parking']
    open_status = data['games'][game]['open']

    return jsonify(users=users,
                   free_parking=free_parking,
                   open=open_status)

@app.route("/who_starts/")
def whoStarts():
    cookie_id = request.cookies['id']
    game = data['users'][cookie_id]['game']
    players = [i for i in data['games'][game]['players']]
    return jsonify(user=random.choice(players))

@app.route("/edit_player_name/", methods = ['POST'])
def editPlayerName():
    if request.cookies['id'] not in data['users']:
        return jsonify()
    if data['users'][request.cookies['id']]['game'] == None:
        return jsonify()

    game = data['users'][request.cookies['id']]['game']
    name = data['users'][request.cookies['id']]['name']

    # Check if banker
    if data['users'][request.cookies['id']]['type'] != "banker":
        return jsonify()

    player_name = request.form['player_name_to_change']
    new_name = request.form['new_name']
    player_id = data['games'][game]['players'][player_name]['id']

    if new_name in ["Bank", "Free Parking", "Player"]:
        return json.dumps({'success':False}), 200, {'ContentType':'application/json'}

    data['users'][player_id]['name'] = new_name
    data['games'][game]['players'][new_name] = data['games'][game]['players'][player_name]
    del data['games'][game]['players'][player_name]
    data['games'][game]['players'][new_name]['name'] = new_name

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/remove_player/", methods = ['POST'])
def removePlayer():
    if request.cookies['id'] not in data['users']:
        return jsonify()
    if data['users'][request.cookies['id']]['game'] == None:
        return jsonify()

    game = data['users'][request.cookies['id']]['game']
    name = data['users'][request.cookies['id']]['name']

    # Check if banker
    if data['users'][request.cookies['id']]['type'] != "banker":
        return jsonify()

    player_name = request.form['player_name_to_remove']
    player_id = data['games'][game]['players'][player_name]['id']

    if data['users'][player_id]['type'] == "banker":
        del data['games'][game]
    else:
        del data['games'][game]['players'][player_name]
    del data['users'][player_id]

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/send_money/", methods = ['POST'])
def sendMoney():
    if request.cookies['id'] not in data['users']:
        return jsonify()
    if data['users'][request.cookies['id']]['game'] == None:
        return jsonify()

    game = data['users'][request.cookies['id']]['game']
    name = data['users'][request.cookies['id']]['name']

    transfer_amount = int(request.form['transfer_amount'])
    player_receiving = request.form['player_receiving']
    banker = request.form['banker']
    banker = [request.form['banker'] == "true"][0]

    if banker:
        if not data['users'][request.cookies['id']]['type'] == 'banker':
            return json.dumps({'success':False}), 200, {'ContentType':'application/json'}

    if not banker:
        if transfer_amount > data['games'][game]['players'][name]['bal']:
            return json.dumps({'success':False, 'reason':"Insufficient Funds"}), 200, {'ContentType':'application/json'}

    if player_receiving == "Bank":
        data['games'][game]['players'][name]['bal'] -= transfer_amount
        data['games'][game]['logs'].append(name + " paid " + str(transfer_amount) + "K to the Bank")
    elif player_receiving == "Free Parking":
        data['games'][game]['players'][name]['bal'] -= transfer_amount
        data['games'][game]['free_parking'] += transfer_amount
        data['games'][game]['logs'].append(name + " put " + str(transfer_amount) + "K in Free Parking")
    else:
        if banker:
            data['games'][game]['players'][player_receiving]['bal'] += transfer_amount
            data['games'][game]['logs'].append("The Bank gave " + str(transfer_amount) + "K to " + player_receiving)
        else:
            data['games'][game]['players'][name]['bal'] -= transfer_amount
            data['games'][game]['players'][player_receiving]['bal'] += transfer_amount
            data['games'][game]['logs'].append(name + " sent " + str(transfer_amount) + "K to " + player_receiving)

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/send_free_parking/", methods = ['POST'])
def sendFreeParking():
    if request.cookies['id'] not in data['users']:
        return jsonify()
    if data['users'][request.cookies['id']]['game'] == None:
        return jsonify()

    game = data['users'][request.cookies['id']]['game']
    name = data['users'][request.cookies['id']]['name']

    # Check if banker
    if data['users'][request.cookies['id']]['type'] != "banker":
        return jsonify()

    player_name = request.form['player']

    data['games'][game]['players'][name]['bal'] += data['games'][game]['free_parking']
    data['games'][game]['logs'].append("Free Parking (" + str(data['games'][game]['free_parking']) + "K) given to " + name)
    data['games'][game]['free_parking'] = 0

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/set_balance/", methods = ['POST'])
def setBalance():
    if request.cookies['id'] not in data['users']:
        return jsonify()
    if data['users'][request.cookies['id']]['game'] == None:
        return jsonify()

    game = data['users'][request.cookies['id']]['game']
    name = data['users'][request.cookies['id']]['name']

    # Check if banker
    if data['users'][request.cookies['id']]['type'] != "banker":
        return jsonify()

    player_name = request.form['player_to_set']
    balance = int(request.form['set_amount'])

    data['games'][game]['players'][name]['bal'] = balance
    data['games'][game]['logs'].append("Bank set balance of " + name + " to " + str(balance) + "K")

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/switch_lock/", methods = ['POST'])
def switchLock():
    if request.cookies['id'] not in data['users']:
        return jsonify()
    if data['users'][request.cookies['id']]['game'] == None:
        return jsonify()

    game = data['users'][request.cookies['id']]['game']

    # Check if banker
    if data['users'][request.cookies['id']]['type'] != "banker":
        return jsonify()

    data['games'][game]['open'] = not data['games'][game]['open']

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}


# Debugging routes
@app.route("/data/")
def data_view():
    a = dictHTMLprint()
    return a.format(data)

class dictHTMLprint(object):
    def format(self, obj, indent = 1):
        if isinstance(obj, dict):
            htmls = []
            for k,v in obj.items():
                htmls.append("<span style='font-style: italic; color: #921212'>%s</span>: %s" % (k,self.format(v,indent+1)))
            return '{<div style="margin-left: %dem">%s</div>}' % (indent, ',<br>'.join(htmls))
        return str(obj)


# Start Server
if __name__ == '__main__':
    ip = data['site_variables']['ip'] if 'ip' in data['site_variables'] else socket.gethostbyname(socket.gethostname())
    port = data['site_variables']['port'] if 'port' in data['site_variables'] else 8080
    print ("Site starting on http://" + ip + ":" + str(port))
    app.run(debug=True, host=ip, port=port)