from json import JSONEncoder
from pprint import pprint
from database_types import *
from typing import List, Tuple
from datetime import datetime, timedelta
from deap import algorithms, base, creator, tools
from statistics import mean
from random import choice, seed, randrange
from copy import deepcopy

from fake_data import fake_person, fake_task


class Shift(TypedDict):
    people: List[Person]
    date: int


class Task(TypedDict):
    id: int
    name: str
    required_people_per_shift: List[RoleAmount]
    score: float  # Lower means task is easier
    shift_duration: int  # in minutes
    shifts: List[Shift]


individual_type = List[Task]


creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)

toolbox = base.Toolbox()


def has_duplicates(individual: individual_type) -> bool:
    """Check if individual has duplicated people."""
    pips_ids = [pip["id"] for task in individual for shift in task["shifts"]
                for pip in shift["people"]]
    return len(pips_ids) != len(set(pips_ids))


def choose_random_pip(individual: individual_type) -> Tuple[Shift, int]:
    """Return random task index and shift index."""
    while True:  # find a non empty task and shift
        task_index = randrange(len(individual))
        if not individual[task_index]["shifts"]:
            continue
        shift = choice(individual[task_index]["shifts"])
        if shift['people']:
            break
    pip_index = randrange(
        len(shift["people"]))
    return shift, pip_index


def find_pip_index(individual: individual_type, person: Person) -> Tuple[Shift, int]:
    """Find person in individual, if not found raise ValueError."""
    for task in individual:
        for shift in task['shifts']:
            for i, pip in enumerate(shift["people"]):
                if pip["id"] == person["id"]:
                    return shift, i
    raise ValueError("Person not found in table")


def generate_random_table(tasks: List[Task], people: List[Person], start_time: datetime, end_time: datetime):
    """Generate random table from tasks and people.

    The method of generation could be roughly described as such:
    1. Make a list of people to insert to the table.
    2. Start looping over tasks.
    3. Create a shift for the current task and fill it
       with people from previously mentioned list.
    4. Move to the next task, if this last shift end time is
       greater then the rest, skip it. That will keep the shifts end times aligned roughly.
    """
    remaining_people = people.copy()
    table = deepcopy(tasks)
    curr_time = {task["id"]: start_time for task in table}
    while True:
        for task in table:
            # check if the current task last shift is past the other tasks, if so, skip it
            add_shift = True
            for time in curr_time.values():
                if curr_time[task["id"]] > time:
                    add_shift = False
                    break
            if not add_shift:
                continue
            task['shifts'].append(
                {"people": [], "date": curr_time[task["id"]].timestamp()})
            needed_pips = sum([i["amount"]
                              for i in task["required_people_per_shift"]])
            while needed_pips:
                if time+timedelta(minutes=task["shift_duration"]) >= end_time:
                    return creator.Individual(table)
                if not remaining_people:
                    remaining_people = deepcopy(people)
                rand_pip = remaining_people.pop(
                    randrange(len(remaining_people)))
                task['shifts'][-1]["people"].append(rand_pip)
                needed_pips -= 1
            curr_time[task["id"]] = curr_time[task["id"]] + \
                timedelta(minutes=task["shift_duration"])


def calc_required_roles_fulfilled(individual: individual_type, tasks: List[Task]) -> Tuple[float, bool]:
    """Calculate the amount of unfulfilled roles in tasks shift. Return a value between 1 to 0."""
    roles_nums = []
    for task in individual:
        for role in task["required_people_per_shift"]:
            role_num = role["amount"]
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


def calc_score_distance(individual: individual_type):
    """Calculate the distance between each task score and it's assigned people."""
    scores = []
    for task in individual:
        for shift in task["shifts"]:
            for pip in shift['people']:
                # calculate difference between scores, higher is better
                scores.append(
                    abs(pip["score"] - task["score"]))
    return sum(scores)/len(scores)


def evaluate(individual: individual_type, tasks: List[Task]):
    """Run all evaluation functions and calculate one merged score."""
    fitness, fulfilled = calc_required_roles_fulfilled(individual, tasks)
    if not fulfilled:  # ignore scores if rules are not fulfilled
        return fitness,
    return fitness + calc_score_distance(individual),


def mate(a: individual_type, b: individual_type, swap_amount: int):
    """Create two new individuals by randomly swapping people between individuals a and b."""
    ind_a = deepcopy(a)
    ind_b = deepcopy(b)
    for _ in range(swap_amount):
        while True:
            shift_a, pip_a = choose_random_pip(ind_a)
            shift_b, pip_b = choose_random_pip(ind_b)
            try:
                shift_a_2, pip_a_2 = find_pip_index(
                    ind_a, shift_b["people"][pip_b])
                shift_b_2, pip_b_2 = find_pip_index(
                    ind_b, shift_a["people"][pip_a])
                break
            except ValueError:
                pass
        shift_a["people"][pip_a], shift_b["people"][pip_b] = \
            shift_b["people"][pip_b], shift_a["people"][pip_a]
        shift_a_2["people"][pip_a_2], shift_b_2["people"][pip_b_2] = \
            shift_b_2["people"][pip_b_2], shift_a_2["people"][pip_a_2]

    return ind_a, ind_b


def mutate(individual: individual_type, swap_amount: int):
    """Randomly swap people inside an individual."""
    for _ in range(swap_amount):
        shift_a, pip_a = choose_random_pip(individual)
        shift_b, pip_b = choose_random_pip(individual)
        shift_a['people'][pip_a], shift_b['people'][pip_b] = \
            shift_b['people'][pip_b], shift_a['people'][pip_a]
    return individual,


def generate_time_table(tasks: List[Task], people: List[Person], start_time: datetime, end_time: datetime) -> individual_type:
    """Calculate an optimized table from tasks and people."""
    seed(64)  # TODO: remove before deployment!
    toolbox.register("evaluate", evaluate, tasks=tasks)
    toolbox.register("mate", mate, swap_amount=len(people)//2)
    toolbox.register("mutate", mutate, swap_amount=len(people)//10)
    toolbox.register("select", tools.selTournament, tournsize=3)
    toolbox.register("population", tools.initRepeat, list,
                     lambda: generate_random_table(tasks, people, start_time, end_time))

    pop = toolbox.population(n=100)
    hof = tools.HallOfFame(1)
    stats = tools.Statistics(lambda ind: ind.fitness.values[0])
    stats.register("mean", mean)
    stats.register("max", max)
    pop, _ = algorithms.eaSimple(
        pop, toolbox, cxpb=0.5, mutpb=0.2, ngen=100, halloffame=hof, stats=stats, verbose=__name__ == "__main__")

    best = pop[-1]
    return best


if __name__ == "__main__":
    START_TIME = datetime.today().replace(hour=10)
    END_TIME = datetime.today().replace(hour=22)
    NUM_OF_TASKS = 3
    NUM_OF_PIPS = 15
    best = generate_time_table([fake_task() for i in range(NUM_OF_TASKS)], [
        fake_person() for i in range(NUM_OF_PIPS)], START_TIME, END_TIME)
    json = JSONEncoder().encode(best)
    print(json)
