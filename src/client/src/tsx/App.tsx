import { useEffect, useRef, useState } from "react";
import { fetchJSON } from "../helpers";

import style from "./App.module.scss";
import { Task } from "./interface";

function App() {
	const firstRender = useRef(true);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [zoomLevel, setZoom] = useState<number>(1);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			fetchJSON("/randomtable")
				.then((tasks) => setTasks(() => tasks))
				.catch(console.log);
			// this is here because react does not natively support "{ passive: false }"
			window.addEventListener("wheel", zoomHandler, { passive: false });
		}
	});

	console.log(JSON.stringify(tasks));

	return (
		<div className={style.app}>
			<div className={style.table}>
				<header className={style.tableHeaders}>
					{tasks.map((task) => (
						<span key={task.id}>{task.name}</span>
					))}
				</header>
				<main className={style.tableView}>
					{tasks.map((task) => (
						<div key={task.id} className={style.taskView}>
							{task.shifts.map((shift) => (
								<div
									key={shift.date}
									className={style.shiftView}
									style={{
										height: task.shift_duration * zoomLevel + "rem",
									}}
								>
									{shift.people.map((person) => (
										<div key={person.id}>
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

	/**
	 * handles window wheel events.
	 * increases or decreases table zoom.
	 */
	function zoomHandler(e: WheelEvent) {
		if (e.ctrlKey) {
			e.preventDefault();
			setZoom((prevState) => prevState * (e.deltaY > 0 ? 0.75 : 1.5));
		}
	}
}

export default App;
