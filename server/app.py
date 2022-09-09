from datetime import datetime
from json import JSONDecoder
from typing import List
from flask import Flask, request, abort
from flask_cors import CORS
import ga
from fake_data import fake_person, fake_task
from database_types import Task, Time_table_nosql

app = Flask(__name__)
CORS(app)


@app.route("/")
@app.route('/randomtable')
def random_table():
    """Return a random table made with fake data."""
    NUM_OF_TASKS = 3
    NUM_OF_PIPS = 20
    START_TIME = datetime.today().replace(hour=10)
    END_TIME = datetime.today().replace(hour=22)
    return ga.generate_random_table([fake_task() for i in range(NUM_OF_TASKS)], [
        fake_person() for i in range(NUM_OF_PIPS)], START_TIME, END_TIME)


@app.route('/randomdata')
def random_data():
    """Return random tasks and people made with fake data."""
    NUM_OF_TASKS = 3
    NUM_OF_PIPS = 20
    return {"tasks": [fake_task() for i in range(NUM_OF_TASKS)], "people": [
        fake_person() for i in range(NUM_OF_PIPS)]}


@app.route("/generate", methods=['POST'])
def generate_table():
    """Get JSON string from client and return optimized table."""
    if (not request.is_json):
        abort(400, 'this endpoint can only accept json')
    try:
        return ga.generate_time_table(request.json['tasks'], request.json['people'],
                                      datetime.fromtimestamp(
                                          request.json['start_time']/1000),
                                      datetime.fromtimestamp(request.json['end_time']/1000))
    except KeyError:
        abort(400, 'json in incorrect format')


@app.route('/test')
def test_table():
    """Return table constructed from our hand-made test data."""
    with open('../../test-data.json') as file:
        test_json = JSONDecoder().decode(file.read())

    time_table = ga.generate_time_table(
        test_json["tasks"], test_json["people"],
        datetime.fromtimestamp(
            request.json['start_time']/1000),
        datetime.fromtimestamp(request.json['end_time']/1000))

    return time_table
