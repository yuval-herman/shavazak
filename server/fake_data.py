from json import JSONEncoder
from pprint import pprint
from random import choice, randint, random, randrange, sample
from faker import Faker
from database_types import *

fake = Faker(use_weighting=False)
roles = ['Driver', 'Medic', 'Officer', 'Commander']
tasks = ['Guard', 'Kitchen', 'Patrol',
         'Operation', 'PillBox', 'Off Duty', 'Rasar Services', 'Hamal']
possibleShiftDurations = [i for i in range(1, 1440) if 1440 % i == 0]


def fake_person() -> Person:
    """Create a random Person."""
    fake_person.id_counter += 1
    return {'id': str(fake_person.id_counter),
            'name': fake.name(),
            'avatar': fake.image_url(2**9, 2**9),
            'roles': sample(roles, randint(0, 3)),
            'score': random(),
            'status': 1,
            }


def fake_task() -> Task:
    """Create a random Task."""
    fake_task.id_counter += 1
    return {'id': str(fake_task.id_counter),
            'name': choice(tasks),
            'required_people_per_shift': [{'role': 'any', 'amount': 1}, {'role': choice(roles), 'amount': randint(1, 2)}],
            'score': random(),
            'shift_duration': choice(possibleShiftDurations),
            'shifts': []}


fake_person.id_counter = 0
fake_task.id_counter = 0

if __name__ == "__main__":
    print(JSONEncoder().encode(
        [[fake_task() for i in range(3)], [fake_person() for i in range(10)]]))
