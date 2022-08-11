from copy import deepcopy
from pprint import pprint
from random import random, seed, randrange
from statistics import mean
from deap import algorithms, base, creator, tools
from datetime import datetime, timedelta
from typing import List

from database_types import *


START_TIME = datetime.today().replace(hour=10)


individual_type = List[Time_table_nosql]


creator.create("FitnessMax", base.Fitness, weights=(1.0, 1.0))
creator.create("Individual", list, fitness=creator.FitnessMax)

toolbox = base.Toolbox()


def generate_random_table(tasks: List[Task], people: List[Person]):
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


def calc_required_roles_fulfilled(individual: individual_type, tasks: List[Task]):
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
    return 1/(max(sum(roles_nums), 1))


def calc_score_difference(individual: individual_type):
    scores = []
    for table_row in individual:
        # calculate difference between scores, higher is better
        scores.append(
            abs(table_row["person"]["score"] - table_row["task"]["score"]))
    return sum(scores)/len(scores)


def evaluate(individual: individual_type, tasks: List[Task]):
    return calc_required_roles_fulfilled(individual, tasks), calc_score_difference(individual)


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


def mutate(individual: individual_type, indpb: float, tasks: List[Task]):
    for i in range(len(individual)):
        if random() > indpb:
            continue
        if random() < 0.5:
            k = randrange(len(individual))
            individual[i]["person"], individual[k]["person"] = individual[k]["person"], individual[i]["person"]
        # else:
        #     individual[i]["task"] = choice(tasks)
    return individual,


# toolbox.register("map", multiprocessing.Pool(processes=50).map)


def generate_time_table(tasks: List[Task], people: List[Person]) -> individual_type:
    toolbox.register("evaluate", lambda x: evaluate(x, tasks))
    toolbox.register("mate", mate)
    toolbox.register("mutate", mutate, indpb=0.2, tasks=tasks)
    toolbox.register("select", tools.selTournament, tournsize=3)
    seed(64)
    toolbox.register("population", tools.initRepeat, list,
                     lambda: generate_random_table(tasks, people))

    pop = toolbox.population(n=100)
    hof = tools.HallOfFame(1)
    stats = tools.Statistics(lambda ind: ind.fitness.values[0])
    stats.register("mean", mean)
    stats.register("max", max)
    pop, _ = algorithms.eaSimple(
        pop, toolbox, cxpb=0.5, mutpb=0.2, ngen=100, halloffame=hof, stats=stats, verbose=False)

    best = pop[-1]
    for i, item in enumerate(best):
        best[i] = {"task": item["task"],
                   "person": item["person"], "date": item["date"].timestamp()}
    return best


if __name__ == "__main__":
    json_dict = {
        "tasks": [
            {
                "id": 0,
                "name": "free time",
                        "required_people_per_shift": [],
                        "score": 0,
                        "shift_duration": 480
            },
            {
                "id": 1,
                "name": "gate guard",
                        "required_people_per_shift": [
                            {
                                "num": 1,
                                "role": "any"
                            },
                            {
                                "num": 1,
                                "role": "commander"
                            }
                        ],
                "score": 0.2,
                "shift_duration": 60
            },
            {
                "id": 2,
                "name": "hamal",
                        "required_people_per_shift": [
                            {
                                "num": 1,
                                "role": "any"
                            }
                        ],
                "score": 0.1,
                "shift_duration": 15,
                "team_id": 0
            },
            {
                "id": 3,
                "name": "patrol",
                        "required_people_per_shift": [
                            {
                                "num": 4,
                                "role": "any"
                            },
                            {
                                "num": 2,
                                "role": "driver"
                            },
                            {
                                "num": 1,
                                "role": "commander"
                            },
                            {
                                "num": 1,
                                "role": "officer"
                            }
                        ],
                "score": 0.8,
                "shift_duration": 0,
                "team_id": 0
            },
            {
                "id": 4,
                "name": "kitchen",
                        "required_people_per_shift": [
                            {
                                "num": 1,
                                "role": "any"
                            }
                        ],
                "score": 0.9,
                "shift_duration": 0,
                "team_id": 0
            },
            {
                "id": 5,
                "name": "back station guard",
                        "required_people_per_shift": [
                            {
                                "num": 1,
                                "role": "any"
                            }
                        ],
                "score": 0.5,
                "shift_duration": 0,
                "team_id": 0
            }
        ],
        "people": [
            {
                "id": 1,
                "name": "Miss Alice Mercer PhD",
                        "roles": ["driver"],
                        "score": 0.318216062949257,
                        "status": 1,
                        "team_id": 0
            },
            {
                "id": 2,
                "name": "Ms. Jessica Shah",
                        "roles": ["driver"],
                        "score": 0.665692016982983,
                        "status": 1,
                        "team_id": 0
            },
            {
                "id": 3,
                "name": "Dr. Alejandra Sexton DVM",
                        "roles": [],
                        "score": 0.00370913597463762,
                        "status": 1,
                        "team_id": 0
            },
            {
                "id": 4,
                "name": "Dr. Kyle Lewis V",
                        "roles": [],
                        "score": 0.415131436874766,
                        "status": 1,
                        "team_id": 0
            },
            {
                "id": 5,
                "name": "Mr. Brett Sanford",
                        "roles": ["medic", "driver"],
                        "score": 0.041852390234935,
                        "status": 1,
                        "team_id": 0
            },
            {
                "id": 6,
                "name": "Ms. Autumn Luna DVM",
                        "roles": ["officer"],
                        "score": 0.230133750065382,
                        "status": 1,
                        "team_id": 0
            },
            {
                "id": 7,
                "name": "Heidi Pearson",
                        "roles": ["commander", "medic"],
                        "score": 0.825495590114626,
                        "status": 1,
                        "team_id": 0
            },
            {
                "id": 8,
                "name": "Brendan Mclaughlin DVM",
                        "roles": [],
                        "score": 0.01075060176758,
                        "status": 1,
                        "team_id": 0
            },
            {
                "id": 9,
                "name": "Dr. Laurie Edwards",
                        "roles": [],
                        "score": 0.847217900872276,
                        "status": 1,
                        "team_id": 0
            },
            {
                "id": 10,
                "name": "Dr. Jose Gay PhD",
                        "roles": ["officer"],
                        "score": 0.133447254818105,
                        "status": 1,
                        "team_id": 0
            }
        ]
    }

    pprint(generate_time_table(json_dict["tasks"], json_dict["people"]))
