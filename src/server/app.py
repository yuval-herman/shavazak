from typing import List
from flask import Flask, request, abort
import ga
from fake_data import fake_person, fake_task
from database_types import Task, Time_table_nosql

app = Flask(__name__)


def sql_table_to_json(time_table: List[Time_table_nosql]):
    tasks: List[Task] = []
    for table_row in time_table:
        if table_row["task"] not in tasks:
            tasks.append(table_row["task"])
            tasks[-1]['shifts'] = []
    for i, task in enumerate(tasks):
        for table_row in time_table:
            if task["id"] == table_row["task"]["id"]:
                tasks[i]['shifts'].append(
                    {'person': table_row["person"], 'date': table_row["date"]})
    return tasks


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
        return sql_table_to_json(ga.generate_time_table(request.json['tasks'], request.json['people']))
    except KeyError:
        abort(400, 'json in incorrect format')


@app.route('/randomtable')
def random_table():
    NUM_OF_TASKS = 3
    NUM_OF_PIPS = 20
    time_table = ga.generate_time_table([fake_task() for i in range(NUM_OF_TASKS)], [
                                        fake_person() for i in range(NUM_OF_PIPS)])

    return sql_table_to_json(time_table)
