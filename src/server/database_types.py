from typing import Dict, List, Tuple, TypedDict


class Person(TypedDict):
    id: int
    name: str
    roles: str
    score: float
    status: int
    team_id: int


class RoleNum(TypedDict):
    role: str
    num: int


class Task(TypedDict):
    id: int
    name: str
    required_people_per_shift: List[RoleNum]
    score: int
    shift_duration: int  # in minutes
    team_id: int


class Team(TypedDict):
    id: int
    name: str


class Time_table(TypedDict):
    id: int
    date: int
    person_id: int
    task_id: int
