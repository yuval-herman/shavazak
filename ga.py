import random

from deap import algorithms
from deap import base
from deap import creator
from deap import tools

GOAL_STR = "Hey mate, cool GA!"

creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)

toolbox = base.Toolbox()

# Attribute generator
toolbox.register("attr_char", lambda: chr(random.randint(31, 127)))

# Structure initializers
toolbox.register("individual", tools.initRepeat,
                 creator.Individual, toolbox.attr_char, len(GOAL_STR))
toolbox.register("population", tools.initRepeat, list, toolbox.individual)


def evalStrCompare(individual):
    return sum([1 for i, c in enumerate(individual) if GOAL_STR[i] == c]),


def mutateStr(individual, indpb):
    for i in range(len(individual)):
        if random.random() > indpb:
            individual[i] = toolbox.attr_char()
    return individual,


toolbox.register("evaluate", evalStrCompare)
toolbox.register("mate", tools.cxTwoPoint)
toolbox.register("mutate", mutateStr, indpb=0.05)
toolbox.register("select", tools.selTournament, tournsize=3)


def main():
    random.seed(64)

    pop = toolbox.population(n=500)
    hof = tools.HallOfFame(5)

    pop, log = algorithms.eaSimple(
        pop, toolbox, cxpb=0.5, mutpb=0.3, ngen=50, halloffame=hof)

    return pop  # , log, hof


if __name__ == "__main__":
    pop = main()
    print(''.join(pop[-1]))
