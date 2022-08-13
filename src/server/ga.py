from json import JSONEncoder
from database_types import *
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
from deap import algorithms, base, creator, tools
from statistics import mean
from random import choice, random, seed, randrange, shuffle
from pprint import pprint
from copy import deepcopy
import multiprocessing

from fake_data import fake_person, fake_task


START_TIME = datetime.today().replace(hour=10)


class Shift(TypedDict):
    people: List[Person]
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


def has_duplicates(individual: individual_type) -> bool:
    pips_ids = [pip["id"] for task in individual for shift in task["shifts"]
                for pip in shift["people"]]
    return len(pips_ids) != len(set(pips_ids))


def choose_random_pip(individual: individual_type) -> Tuple[Shift, int]:
    """returns random task index and shift index"""
    task_index = randrange(len(individual))
    while True:
        task_index = randrange(len(individual))
        if not len(individual[task_index]["shifts"]):
            continue
        shift = choice(individual[task_index]["shifts"])
        if len(shift['people']):
            break
    pip_index = randrange(
        len(shift["people"]))
    return shift, pip_index


def find_pip_index(individual: individual_type, person: Person) -> Tuple[Shift, int]:
    for task in individual:
        for shift in task['shifts']:
            for i, pip in enumerate(shift["people"]):
                if pip["id"] == person["id"]:
                    return shift, i
    raise ValueError("Person not found in table")


def generate_random_table(tasks: List[Task], people: List[Person]):
    remaining_people = people[:]
    curr_time = {task["id"]: START_TIME for task in tasks}
    for task in tasks:
        task['shifts'] = []
    while True:
        for task in tasks:
            add_shift = True
            for time in curr_time.values():
                if curr_time[task["id"]] > time:
                    add_shift = False
                    break
            if not add_shift:
                continue
            task['shifts'].append(
                {"people": [], "date": curr_time[task["id"]].timestamp()})
            needed_pips = sum([i["num"]
                              for i in task["required_people_per_shift"]])
            while needed_pips:
                if not remaining_people:
                    return creator.Individual(tasks)
                rand_pip = remaining_people.pop(
                    randrange(len(remaining_people)))
                task['shifts'][-1]["people"].append(rand_pip)
                needed_pips -= 1
            curr_time[task["id"]] = curr_time[task["id"]] + \
                timedelta(minutes=task["shift_duration"])


def calc_required_roles_fulfilled(individual: individual_type, tasks: List[Task]) -> Tuple[float, bool]:
    roles_nums = []
    for task in individual:
        for role in task["required_people_per_shift"]:
            role_num = role["num"]
            if role_num == 0:
                continue
            for shift in task["shifts"]:
                pips_roles = [pip["roles"] for pip in shift["people"]]
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
            for pip in shift['people']:
                # calculate difference between scores, higher is better
                scores.append(
                    abs(pip["score"] - task["score"]))
    return sum(scores)/len(scores)


def evaluate(individual: individual_type, tasks: List[Task]):
    fitness, fulfilled = calc_required_roles_fulfilled(individual, tasks)
    if not fulfilled:  # ignore scores if rules are not fulfilled
        return fitness,
    return fitness + calc_score_difference(individual),


def mate(a: individual_type, b: individual_type, swap_amount: int):
    '''
    There can be two types of exchanges between individuals.
    Either you switch task, or you switch date
    '''
    ind_a = deepcopy(a)
    ind_b = deepcopy(b)
    for _ in range(swap_amount):
        shift_a, pip_a = choose_random_pip(ind_a)
        shift_b, pip_b = choose_random_pip(ind_b)
        shift_a_2, pip_a_2 = find_pip_index(ind_a, shift_b["people"][pip_b])
        shift_b_2, pip_b_2 = find_pip_index(ind_b, shift_a["people"][pip_a])
        shift_a["people"][pip_a], shift_b["people"][pip_b] = \
            shift_b["people"][pip_b], shift_a["people"][pip_a]
        shift_a_2["people"][pip_a_2], shift_b_2["people"][pip_b_2] = \
            shift_b_2["people"][pip_b_2], shift_a_2["people"][pip_a_2]

    return ind_a, ind_b


def mutate(individual: individual_type, swap_amount: int):
    for _ in range(swap_amount):
        shift_a, pip_a = choose_random_pip(individual)
        shift_b, pip_b = choose_random_pip(individual)
        shift_a['people'][pip_a], shift_b['people'][pip_b] = \
            shift_b['people'][pip_b], shift_a['people'][pip_a]
    return individual,


def generate_time_table(tasks: List[Task], people: List[Person]) -> individual_type:
    seed(64)  # TODO: remove before deployment!
    # toolbox.register("map", multiprocessing.Pool().map)
    toolbox.register("evaluate", evaluate, tasks=tasks)
    toolbox.register("mate", mate, swap_amount=len(people)//2)
    toolbox.register("mutate", mutate, swap_amount=len(people)//10)
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
    NUM_OF_TASKS = 3
    NUM_OF_PIPS = 15
    best = generate_time_table([fake_task() for i in range(NUM_OF_TASKS)], [
        fake_person() for i in range(NUM_OF_PIPS)])
    json = JSONEncoder().encode(best)
    print(json)
