from pprint import pprint
from random import choice, randint, random, randrange, sample
from faker import Faker
from database_types import *

fake = Faker(use_weighting=False)
roles = ['driver', 'medic', 'officer', 'commander']
tasks = ['guard', 'kitchen', 'patrol',
         'operation', 'pill box', 'free', 'rasar service']


def fake_person() -> Person:
    fake_person.id_counter += 1
    return {'id': fake_person.id_counter,
            'name': fake.name(),
            'roles': sample(roles, randint(0, 3)),
            'score': random(),
            'status': 1,
            'team_id': 0}


def fake_task() -> Task:
    fake_task.id_counter += 1
    return {'id': fake_task.id_counter,
            'name': choice(tasks),
            'required_people_per_shift': [{'role': 'any', 'num': 1}, {'role': choice(roles), 'num': randint(1, 2)}],
            'score': random(),
            'shift_duration': randrange(0, 61, 5),
            'team_id': 0}


fake_person.id_counter = 0
fake_task.id_counter = 0
