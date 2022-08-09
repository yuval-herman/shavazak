from flask import Flask
import ga
from fake_data import fake_person, fake_task

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/randomtable')
def random_table():
    NUM_OF_TASKS = 3
    NUM_OF_PIPS = 20

    return ga.generate_time_table([fake_task() for i in range(NUM_OF_TASKS)], [fake_person() for i in range(NUM_OF_PIPS)])
