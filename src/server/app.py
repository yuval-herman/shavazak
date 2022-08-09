from typing import List
from flask import Flask
import ga
from fake_data import fake_person, fake_task
from database_types import Task

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/randomtable')
def random_table():
    NUM_OF_TASKS = 3
    NUM_OF_PIPS = 20
    time_table = ga.generate_time_table([fake_task() for i in range(NUM_OF_TASKS)], [
                                        fake_person() for i in range(NUM_OF_PIPS)])
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
