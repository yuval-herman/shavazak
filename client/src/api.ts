import { isPerson, Person, Task } from "./types";

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

export function savePerson(person: Person) {
	const people = getPeople();
	const index = people.findIndex((pip) => pip.id === person.id);
	if (index === -1) people.push(person);
	else people[index] = person;
	localStorage.setItem("people", JSON.stringify(people));
}

export function saveTask(task: Task) {
	const tasks = getTasks();
	const index = tasks.findIndex((t) => t.id === task.id);
	if (index === -1) tasks.push(task);
	else tasks[index] = task;
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function getTasks(): Task[] {
	return JSON.parse(localStorage.getItem("tasks") ?? "[]");
}

export function getPeople(): Person[] {
	return JSON.parse(localStorage.getItem("people") ?? "[]");
}
