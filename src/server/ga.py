from database_types import *
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
from deap import algorithms, base, creator, tools
from statistics import mean
from random import random, seed, randrange, shuffle
from pprint import pprint
from copy import deepcopy
import multiprocessing


START_TIME = datetime.today().replace(hour=10)


class Shift(TypedDict):
    person: Person
    date: int


class Task(TypedDict):
    id: int
    name: str
    required_people_per_shift: List[RoleNum]
    score: float  # Lower means task is easier
    shift_duration: int  # in minutes
    shifts: List[Shift]


individual_type = List[Task]


creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)

toolbox = base.Toolbox()


def generate_random_table(tasks: List[Task], people: List[Person]):
    remaining_people = people[:]
    curr_time = {task["id"]: START_TIME for task in tasks}
    for task in tasks:
        task['shifts'] = []
    while True:
        for task in tasks:
            if not remaining_people:
                return creator.Individual(tasks)
            rand_pip = remaining_people.pop(
                randrange(len(remaining_people)))
            task['shifts'].append(
                {"person": rand_pip, "date": curr_time[task["id"]].timestamp()})
            curr_time[task["id"]] = curr_time[task["id"]] + \
                timedelta(minutes=task["shift_duration"])


def calc_required_roles_fulfilled(individual: individual_type, tasks: List[Task]) -> Tuple[float, bool]:
    roles_nums = []
    for task in individual:
        for role in task["required_people_per_shift"]:
            role_num = role["num"]
            if role_num == 0:
                continue
            pips_roles = [shift["person"]["roles"] for shift in task["shifts"]]
            for pip_roles in pips_roles:
                if role["role"] == 'any' or \
                        role["role"] in pip_roles:
                    if role_num < 1:
                        continue
                    pips_roles.remove(pip_roles)
                    role_num -= 1
            roles_nums.append(role_num)
    return 1/(sum(roles_nums)+1), not bool([i for i in roles_nums if float(i) != 0.0])


def calc_score_difference(individual: individual_type):
    scores = []
    for task in individual:
        for shift in task["shifts"]:
            # calculate difference between scores, higher is better
            scores.append(
                abs(shift["person"]["score"] - task["score"]))
    return sum(scores)/len(scores)


def evaluate(individual: individual_type, tasks: List[Task]):
    fitness, fulfilled = calc_required_roles_fulfilled(individual, tasks)
    if not fulfilled:  # ignore scores if rules are not fulfilled
        return fitness,
    return fitness + calc_score_difference(individual),


def mate(a: individual_type, b: individual_type, indpb):
    '''
    There can be two types of exchanges between individuals.
    Either you switch task, or you switch date
    '''
    ind_a = deepcopy(a)
    ind_b = deepcopy(b)
    for task_index in range(len(a)):
        if random() > indpb:
            continue
        try:
            pip_a_index = randrange(len(a[task_index]["shifts"]))
            pip_b_index = randrange(len(b[task_index]["shifts"]))
        except ValueError:
            continue
        ind_a[task_index]["shifts"][pip_a_index], ind_b[task_index]["shifts"][pip_b_index] = \
            ind_b[task_index]["shifts"][pip_b_index], ind_a[task_index]["shifts"][pip_a_index]
    return ind_a, ind_b


def mutate(individual: individual_type, indpb: float, tasks: List[Task]):
    for i in range(len(individual)):
        for shiftI in range(len(individual[i]["shifts"])):
            if random() > indpb:
                continue
            tasks_index = list(range(len(individual)))
            shuffle(tasks_index)
            while tasks_index:
                k = tasks_index.pop()
                if len(individual[k]["shifts"]):
                    shiftK = randrange(
                        len(individual[k]["shifts"]))
                    break
            else:  # if there are people there is nothing to do
                individual
            if random() < 0.5:
                individual[i]["shifts"][shiftI]["person"], individual[k]["shifts"][shiftK]["person"] = \
                    individual[k]["shifts"][shiftK]["person"], individual[i]["shifts"][shiftI]["person"]
            else:
                new_time = (datetime.fromtimestamp(individual[i]["shifts"][-1]["date"]) +
                            timedelta(minutes=individual[i]["shift_duration"])).timestamp()
                person = individual[k]["shifts"].pop(shiftK)["person"]
                individual[i]["shifts"].append(
                    {"date": new_time, "person": person})
    return individual,


def generate_time_table(tasks: List[Task], people: List[Person]) -> individual_type:
    seed(64)
    # toolbox.register("map", multiprocessing.Pool().map)
    toolbox.register("evaluate", evaluate, tasks=tasks)
    toolbox.register("mate", mate, indpb=0.2)
    toolbox.register("mutate", mutate, indpb=0.2, tasks=tasks)
    toolbox.register("select", tools.selTournament, tournsize=3)
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
