from typing import TypedDict


class Person(TypedDict):
    id: int
    name: str
    roles: str
    score: float
    status: int
    team_id: int


class Task(TypedDict):
    id: int
    name: str
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
