import { Person, Task } from "./types";

// A wrapper around fetch that posts an object to the given url
export async function fetchPOST(
	input: RequestInfo | URL,
	data: any,
	init?: RequestInit
) {
	return (
		await fetch(input, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: typeof data === "object" ? JSON.stringify(data) : data,
		})
	).json();
}

// A wrapper around fetch that returns an object from a url
export async function fetchJSON(input: RequestInfo | URL, init?: RequestInit) {
	return (await fetch(input, init)).json();
}

// Saves a person to localStorage or updates one if it already exists
export function savePerson(person: Person) {
	const people = getPeople();
	const index = people.findIndex((pip) => pip.id === person.id);
	if (index === -1) people.push(person);
	else people[index] = person;
	localStorage.setItem("people", JSON.stringify(people));
}

// Saves a task to localStorage or updates one if it already exists
export function saveTask(task: Task) {
	const tasks = getTasks();
	const index = tasks.findIndex((t) => t.id === task.id);
	if (index === -1) tasks.push(task);
	else tasks[index] = task;
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Removes a person from localStorage
export function deletePerson(id: string) {
	const people = getPeople();
	const index = people.findIndex((pip) => pip.id === id);
	people.splice(index, 1);
	localStorage.setItem("people", JSON.stringify(people));
}

// Removes a task from localStorage
export function deleteTask(id: string) {
	const tasks = getTasks();
	const index = tasks.findIndex((t) => t.id === id);
	tasks.splice(index, 1);
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function getTasks(): Task[] {
	return JSON.parse(localStorage.getItem("tasks") ?? "[]");
}

export function getPeople(): Person[] {
	return JSON.parse(localStorage.getItem("people") ?? "[]");
}

export function setPeople(people: Person[]) {
	localStorage.setItem("people", JSON.stringify(people));
}

export function setTasks(tasks: Task[]) {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Retrieves all roles saved in people and tasks
export function getRolesFromData(people?: Person[], tasks?: Task[]) {
	if (!people) people = [];
	if (!tasks) tasks = [];
	return [
		...new Set(
			people
				.map((person) => person.roles)
				.flat()
				.concat(
					tasks
						.map((task) =>
							task.required_people_per_shift.map(
								(requirment) => requirment.role
							)
						)
						.flat()
				)
		),
	];
}
