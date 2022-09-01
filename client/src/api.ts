import { isPerson, Person, Task } from "./types";

export function savePerson(person: Person) {
	const people: Person[] = JSON.parse(localStorage.getItem("people") ?? "[]");
	const index = people.findIndex((pip) => pip.id === person.id);
	if (index === -1) people.push(person);
	else people[index] = person;
	localStorage.setItem("people", JSON.stringify(people));
}

export function saveTask(task: Task) {
	const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") ?? "[]");
	const index = tasks.findIndex((t) => t.id === task.id);
	if (index === -1) tasks.push(task);
	else tasks[index] = task;
	tasks.push(task);
	localStorage.setItem("tasks", JSON.stringify(tasks));
}
