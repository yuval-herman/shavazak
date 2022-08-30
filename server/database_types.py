from json import JSONDecoder, JSONEncoder
from typing import List, TypedDict


class Person(TypedDict):
    id: int
    name: str
    roles: List[str]
    score: float  # Lower means life is easier :)
    status: int


class RoleAmount(TypedDict):
    role: str
    amount: int


class Shift(TypedDict):
    people: List[Person]
    date: float


class Task(TypedDict):
    id: int
    name: str
    required_people_per_shift: List[RoleAmount]
    score: float  # Lower means task is easier
    shift_duration: int  # in minutes
    shifts: List[Shift]


class Team(TypedDict):
    id: int
    name: str


class Time_table(TypedDict):
    id: int
    date: float
    person_id: int
    task_id: int


class Time_table_nosql(TypedDict):
    date: int
    person: Person
    task: Task
