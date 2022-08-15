import { useEffect, useRef, useState } from "react";

import style from "./App.module.scss";
import { Task } from "./interface";

function App() {
	const firstRender = useRef(true);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [zoomLevel, setZoom] = useState<number>(1);
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			fetch("/randomtable")
				.then((res) => res.json().then((tasks) => setTasks(() => tasks)))
				.catch(console.log);
			window.addEventListener("wheel", zoomHandler, { passive: false });
		}
	});

	console.log(tasks);

	return (
		<div className={style.app}>
			<div className={style.table}>
				<header className={style.tableHeaders}>
					{tasks.map((task) => (
						<span>{task.name}</span>
					))}
				</header>
				<main className={style.tableView}>
					{tasks.map((task) => (
						<div>
							{task.shifts.map((shift) => (
								<div
									className={style.taskView}
									style={{
										height: task.shift_duration * zoomLevel + "rem",
									}}
								>
									{shift.people.map((person) => (
										<div>
											<p>{person.name}</p>
											<span>{person.roles.join(", ")}</span>
										</div>
									))}
								</div>
							))}
						</div>
					))}
				</main>
			</div>
		</div>
	);

	function zoomHandler(e: WheelEvent) {
		if (e.ctrlKey) {
			e.preventDefault();
			setZoom((prevState) => prevState * (e.deltaY > 0 ? 0.75 : 1.5));
		}
	}
}

export default App;
