import Avatar from "boring-avatars";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPOST } from "../../api";
import { PeopleContext } from "../../context/PeopleContext";
import { TasksContext } from "../../context/TasksContext";
import { Shift, Task } from "../../types";
import Loader from "../Loader/Loader";
import { MainNavbar } from "../MainNavbar/MainNavbar";
import style from "./App.module.scss";

interface Props {
	tasks: Task[];
}

function ShiftDiv(props: { shift: Shift; height: string | number }) {
	return (
		<div className={style.shift} style={{ height: props.height }}>
			{props.shift.people.map((person) => (
				<div key={person.id} className={style.person}>
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
				<ShiftDiv
					key={i}
					shift={shift}
					height={`${props.task.shift_duration / 5}rem`}
				/>
			))}
		</div>
	);
}

function TasksTable(props: Props) {
	const tasks = props.tasks;

	return (
		<>
			<header className={style.headers}>
				{tasks.map((task) => (
					<div key={task.id} id="header-div">
						{task.name}
					</div>
				))}
			</header>
			<main className={style.column}>
				{tasks.map((task) => (
					<TaskDiv key={task.id} task={task} width={100 / tasks.length} />
				))}
			</main>
		</>
	);
}

function App() {
	const [tasks, setTasks] = useState<Task[]>();
	const [timelineOffset, setTimelineOffset] = useState<number>(0);
	const peopleContext = useContext(PeopleContext);
	const tasksContext = useContext(TasksContext);
	const fetched = useRef(false);

	useEffect(() => {
		if (cacheUpToDate()) {
			return;
		}
		if (fetched.current) {
			fetched.current = false;
			return;
		}
		const tasksPips = {
			people: peopleContext.people,
			tasks: tasksContext.tasks,
			start_time: tasksContext.start_time.getTime(),
			end_time: tasksContext.end_time.getTime(),
		};
		fetched.current = true;
		fetchPOST("/api/generate", tasksPips)
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

	useEffect(() => {
		const moveTimeline = () => {
			const headerDiv = document.getElementById("header-div");
			if (!headerDiv) return;
			setTimelineOffset(headerDiv.getBoundingClientRect().height);
		};
		moveTimeline();
		window.addEventListener("resize", moveTimeline);
	});

	return (
		<>
			<MainNavbar />
			<div className={style.container}>
				<div
					className={style.timeline}
					style={{
						top: timelineOffset,
					}}
				>
					{[...Array(96).keys()].map((i) => (
						<div className={style.time}>
							{(() => {
								const time = new Date(0, 0, 0, 0, 0, 0, 0);
								time.setMinutes(i * 15);
								return time.toTimeString().split(":").slice(0, 2).join(":");
							})()}
							<hr />
						</div>
					))}
				</div>
				<div className={style.main}>
					{tasks ? (
						<TasksTable tasks={tasks} />
					) : cacheUpToDate() ? (
						<TasksTable
							tasks={JSON.parse(localStorage.getItem("cachedTable")!).table}
						/>
					) : peopleContext.people.length && tasksContext.tasks.length ? (
						<Loader className={style.loader} />
					) : (
						<div>
							No tasks or people added, consider{" "}
							<Link to={"/tablemanager/addperson"}>adding some</Link> or{" "}
							<Link to={"/randomdata"}>using random data</Link>
						</div>
					)}
				</div>
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
