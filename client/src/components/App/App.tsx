import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPOST } from "../../api";
import { PeopleContext } from "../../context/PeopleContext";
import { TasksContext } from "../../context/TasksContext";
import { Shift, Task } from "../../types";
import { MainNavbar } from "../MainNavbar/MainNavbar";
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
			className={style.task}
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
			<main className={style.column}>
				{tasks.map((task) => (
					<TaskDiv key={task.id} task={task} width={100 / tasks.length} />
				))}
			</main>
		</div>
	);
}

function App() {
	const [tasks, setTasks] = useState<Task[]>();
	const peopleContext = useContext(PeopleContext);
	const tasksContext = useContext(TasksContext);

	useEffect(() => {
		if (cacheUpToDate()) {
			return;
		}

		const end_time = new Date();
		end_time.setHours(end_time.getHours() + 5);
		const tasksPips = {
			people: peopleContext.people,
			tasks: tasksContext.tasks,
			start_time: new Date().getTime(),
			end_time: end_time.getTime(),
		};
		fetchPOST("generate", tasksPips)
			.then((res) => {
				localStorage.setItem(
					"cachedTable",
					JSON.stringify({ table: res, ...tasksPips })
				);
				setTasks(res);
			})
			.catch(console.error);
		// eslint-disable-next-line
	}, [peopleContext.people, tasksContext.tasks]);

	return (
		<>
			<MainNavbar />
			<button
				onClick={() => {
					localStorage.removeItem("cachedTable");
					setTasks(undefined);
				}}
			>
				Reload
			</button>
			<div className={style.main}>
				{tasks ? (
					<TasksTable tasks={tasks} />
				) : cacheUpToDate() ? (
					<TasksTable
						tasks={JSON.parse(localStorage.getItem("cachedTable")!).table}
					/>
				) : peopleContext.people.length && tasksContext.tasks.length ? (
					"Loading tasks..."
				) : (
					<div>
						No tasks or people added, consider{" "}
						<Link to={"/tablemanager/addperson"}>adding some</Link>
					</div>
				)}
			</div>
		</>
	);

	function cacheUpToDate() {
		const cachedTable = JSON.parse(
			localStorage.getItem("cachedTable") ?? "null"
		);
		return (
			cachedTable &&
			JSON.stringify(cachedTable.people) ===
				JSON.stringify(peopleContext.people) &&
			JSON.stringify(cachedTable.tasks) === JSON.stringify(tasksContext.tasks)
		);
	}
}
export default App;
