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
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/generate", methods=['POST'])
def generate_table():
    """
    accepts json formatted as follows:
    {
        "tasks": [{
            "name": string,
            "required_people_per_shift": [
                {
                    "num": int,
                    "role": string
                }
            ],
            "score": float,
            "shift_duration": int
        }],
        "people": [{
            "date": float,
            "person": {
                "name": string,
                "roles": [string],
                "score": float,
                "status": int,
            }}]
    }
    """
    if (not request.is_json):
        abort(400, 'this endpoint can only accept json')
    try:
        return ga.generate_time_table(request.json['tasks'], request.json['people'])
    except KeyError:
        abort(400, 'json in incorrect format')


@app.route('/randomtable')
def random_table():
    NUM_OF_TASKS = 3
    NUM_OF_PIPS = 20
    time_table = ga.generate_time_table([fake_task() for i in range(NUM_OF_TASKS)], [
                                        fake_person() for i in range(NUM_OF_PIPS)])

    return time_table


@app.route('/test')
def test_table():
    with open('../../test-data.json') as file:
        test_json = JSONDecoder().decode(file.read())

    time_table = ga.generate_time_table(
        test_json["tasks"], test_json["people"])

    return time_table
