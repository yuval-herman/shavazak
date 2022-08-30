import { useEffect, useState } from "react";
import { Shift, Task } from "../types";
import style from "./App.module.scss";

interface Props {
	tasks: Task[];
}

function ShiftDiv(props: { shift: Shift }) {
	return (
		<div className={style.shift}>
			{props.shift.people.map((person) => (
				<div key={person.id}>{person.name}</div>
			))}
		</div>
	);
}

function TaskDiv(props: { task: Task; width: number }) {
	return (
		<div
			key={props.task.id}
			className={style.shifts}
			style={{ width: props.width }}
		>
			{props.task.shifts.map((shift) => (
				<ShiftDiv shift={shift} />
			))}
		</div>
	);
}

function TasksTable(props: Props) {
	const tasks = props.tasks;

	return (
		<div>
			<header className={style.headers}>
				{tasks.map((task) => (
					<div key={task.id}>{task.name}</div>
				))}
			</header>
			<main className={style.tasks}>
				{tasks.map((task) => (
					<TaskDiv task={task} width={100 / tasks.length} />
				))}
			</main>
		</div>
	);
}

function App() {
	const [tasks, setTasks] = useState<Task[]>();
	useEffect(() => {
		fetch("/randomtable").then((res) => res.json().then(setTasks));
	}, []);

	return (
		<div className={style.main}>
			{tasks ? <TasksTable tasks={tasks} /> : "Loading tasks"}
		</div>
	);
}
export default App;
