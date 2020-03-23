import os
import sys
import requests
import json

from flask import Flask, session, request, jsonify, redirect, url_for, abort
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from sqlalchemy.sql.expression import cast
import sqlalchemy

from flask import render_template
from flask_table import Table, Col

app = Flask(__name__)
app.secret_key = "1234"


@app.route("/", methods = ["GET", "POST"])
def index():
    return render_template("home.html")


@app.route("/", methods = ["GET", "POST"])
def results():
    return render_template("home.html")
