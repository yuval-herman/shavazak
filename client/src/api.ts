import { Person, Task } from "./types";

export function savePerson(person: Person) {
	const people: Person[] = JSON.parse(localStorage.getItem("people") ?? "[]");
	people.push(person);
	localStorage.setItem("people", JSON.stringify(people));
}

export function saveTask(task: Task) {
	const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") ?? "[]");
	tasks.push(task);
	localStorage.setItem("tasks", JSON.stringify(tasks));
}
