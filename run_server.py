from flask import Flask, request, render_template, make_response, redirect, url_for, session, abort, send_from_directory
import os
import json
import socket
import logging

# Base definitions

def loadData():
    try:
        with open("site_data.json", 'r') as data_file:
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
app = Flask(__name__, static_url_path='')
app.secret_key = data['site_variables']['secret_key'] if 'secret_key' in data['site_variables'] else 'secretkey1568486123168'

# App routes

@app.route("/")
def home_page():
    return ("This is the main page")

# Start Server

if __name__ == '__main__':
    ip = data['site_variables']['ip'] if 'ip' in data['site_variables'] else socket.gethostbyname(socket.gethostname())
    port = data['site_variables']['port'] if 'port' in data['site_variables'] else 8080
    print ("Site starting on http://" + ip + ":" + str(port))
    app.run(debug=True, host=ip, port=port)