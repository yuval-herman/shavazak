from copy import deepcopy
from json import JSONEncoder
from random import random, seed, randrange
from statistics import mean
from deap import algorithms, base, creator, tools
from datetime import datetime, timedelta
from typing import List
from fake_data import fake_person, fake_task
import multiprocessing

from database_types import *


START_TIME = datetime.today().replace(hour=10)


class Time_table(TypedDict):
    date: int
    person: Person
    task: Task


individual_type = List[Time_table]

tasks: List[Task] = [fake_task() for i in range(3)]

people: List[Person] = [fake_person() for i in range(10)]


creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)

toolbox = base.Toolbox()


def generate_random_table():
    ind: individual_type = creator.Individual()
    remaining_people = people[:]
    curr_time = {task["id"]: START_TIME for task in tasks}
    while True:
        for task in tasks:
            if not remaining_people:
                return ind
            rand_pip = remaining_people.pop(
                randrange(len(remaining_people)))
            ind.append(
                {"date": curr_time[task["id"]], "person": rand_pip, "task": task})
            curr_time[task["id"]] = curr_time[task["id"]] + \
                timedelta(minutes=task["shift_duration"])


toolbox.register("population", tools.initRepeat, list, generate_random_table)


def calc_required_roles_fulfilled(individual: individual_type):
    roles_nums = []
    for task in tasks:
        for role in task["required_people_per_shift"]:
            role_num = role["num"]
            for table_row in individual:
                if table_row["task"]["id"] == task["id"]:
                    if role["role"] == 'any' or \
                            role["role"] in table_row["person"]["roles"]:
                        role_num -= 1
                        if role_num == 0:
                            break
            roles_nums.append(role_num)
    return 1/(sum(roles_nums)+1)


def calc_score_difference(individual: individual_type):
    scores = []
    for table_row in individual:
        # calculate difference between scores, higher is better
        scores.append(
            abs(table_row["person"]["score"] - table_row["task"]["score"]))
    return sum(scores)/len(scores)


def evaluate(individual: individual_type):
    return calc_required_roles_fulfilled(individual)+calc_score_difference(individual),


def mate(a: individual_type, b: individual_type, indpb: float = 0.1):
    '''
    There can be two types of exchanges between individuals.
    Either you switch task, or you switch date
    '''
    ind_a = deepcopy(a)
    ind_b = deepcopy(b)
    for i, ind_a_row in enumerate(a):
        if random() > indpb:
            continue
        pip_id = ind_a_row["person"]["id"]
        for k, ind_b_row in enumerate(ind_b):
            if ind_b_row["person"]["id"] == pip_id:
                ind_a[i]["person"], ind_b[k]["person"] = ind_b[k]["person"], ind_a[i]["person"]
    return ind_a, ind_b


def mutate(individual: individual_type, indpb: float):
    for i in range(len(individual)):
        if random() > indpb:
            continue
        k = randrange(len(individual))
        individual[i]["person"], individual[k]["person"] = individual[k]["person"], individual[i]["person"]
    return individual,


toolbox.register("evaluate", evaluate)
toolbox.register("mate", mate)
toolbox.register("mutate", mutate, indpb=0.05)
toolbox.register("select", tools.selTournament, tournsize=3)
# toolbox.register("map", multiprocessing.Pool(processes=50).map)


def main():
    seed(64)

    pop = toolbox.population(n=100)
    hof = tools.HallOfFame(1)
    stats = tools.Statistics(lambda ind: ind.fitness.values[0])
    stats.register("mean", mean)
    stats.register("max", max)

    pop, log = algorithms.eaSimple(
        pop, toolbox, cxpb=0.5, mutpb=0.3, ngen=10, halloffame=hof, stats=stats)

    return pop


if __name__ == "__main__":
    pop: List[individual_type] = main()
    best = pop[-1]
    for i, item in enumerate(best):
        best[i] = {"task": item["task"],
                   "person": item["person"], "date": item["date"].timestamp()}
    best.sort(key=lambda x: x["date"])
    print(JSONEncoder().encode(best))
