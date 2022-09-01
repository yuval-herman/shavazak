import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shift, Task } from "../types";
import style from "./App.module.scss";

interface Props {
	tasks: Task[];
}

function ShiftDiv(props: { shift: Shift }) {
	return (
		<div className={style.shift}>
			{props.shift.people.map((person) => (
				<span key={person.id}>
					<img width={50} alt="avatar" src={person.avatar} />
					<span key={person.id}>{person.name}</span>
					<hr />
				</span>
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
				<ShiftDiv key={shift.date} shift={shift} />
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
					<TaskDiv key={task.id} task={task} width={100 / tasks.length} />
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
		<>
			<Link to="/tablemanager">manager view</Link>
			<div className={style.main}>
				{tasks ? <TasksTable tasks={tasks} /> : "Loading tasks..."}
			</div>
		</>
	);
}
export default App;
