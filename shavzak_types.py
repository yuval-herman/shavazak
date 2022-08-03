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
class Task():
    id: int
    name: str
    score: int
    shift_duration: int  # in minutes
    team_id: int


@dataclass
class Team():
    id: int
    name: str


@dataclass
class Time_table():
    id: int
    date: int
    person_id: int
    task_id: int
