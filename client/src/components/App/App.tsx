import { useEffect, useRef, useState } from "react";
import { fetchPOST, getPeople, getTasks } from "../../api";
import { MainNavbar } from "../MainNavbar/MainNavbar";
import { Shift, Task } from "../../types";
import style from "./App.module.scss";

interface Props {
	tasks: Task[];
}

function ShiftDiv(props: { shift: Shift }) {
	return (
		<div className={style.shift}>
			{props.shift.people.map((person) => (
				<div key={person.id} className={style.person}>
					<img alt="avatar" src={person.avatar} />
					<span key={person.id}>{person.name}</span>
				</div>
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
			{props.task.shifts.map((shift, i) => (
				<ShiftDiv key={i} shift={shift} />
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
	const firstRender = useRef(true);

	useEffect(() => {
		if (!firstRender.current) return;
		const end_time = new Date();
		end_time.setHours(end_time.getHours() + 5);
		const table = {
			people: getPeople(),
			tasks: getTasks(),
			start_time: new Date().getTime(),
			end_time: end_time.getTime(),
		};
		console.log(table);
		fetchPOST("generate", table).then(setTasks).catch(console.error);
		firstRender.current = false;
	}, []);

	return (
		<>
			<MainNavbar />
			<div className={style.main}>
				{tasks ? <TasksTable tasks={tasks} /> : "Loading tasks..."}
			</div>
		</>
	);
}
export default App;
