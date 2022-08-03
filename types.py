from dataclasses import dataclass
from typing import List


@dataclass
class Person():
    id: int
    name: str
    roles: List[str]
    score: float
    status: int
    team_id: int

@dataclass
class task():
    id: int
    name: str
    score: int
    shift_duration: int # in minutes
    team_id: int

@dataclass
class team():
    id: int
    name: str

@dataclass
class time_table():
    id: int
    date: int
    person_id: int
    task_id: int