from json import JSONEncoder
from pprint import pprint
from random import choice, randint, random, randrange, sample
from faker import Faker
from database_types import *

fake = Faker(use_weighting=False)
roles = ['driver', 'medic', 'officer', 'commander']
tasks = ['guard', 'kitchen', 'patrol',
         'operation', 'pill box', 'free', 'rasar service', 'hamal']


def fake_person() -> Person:
    """Create a random Person."""
    fake_person.id_counter += 1
    return {'id': fake_person.id_counter,
            'name': fake.name(),
            'roles': sample(roles, randint(0, 3)),
            'score': random(),
            'status': 1,
            }


def fake_task() -> Task:
    """Create a random Task."""
    fake_task.id_counter += 1
    return {'id': fake_task.id_counter,
            'name': choice(tasks),
            'required_people_per_shift': [{'role': 'any', 'amount': 1}, {'role': choice(roles), 'amount': randint(1, 2)}],
            'score': random(),
            'shift_duration': randrange(30, 601, 5),
            'shifts': []}


fake_person.id_counter = 0
fake_task.id_counter = 0

if __name__ == "__main__":
    print(JSONEncoder().encode(
        [[fake_task() for i in range(3)], [fake_person() for i in range(10)]]))
