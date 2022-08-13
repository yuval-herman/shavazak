import { useEffect, useRef, useState } from "react";

import style from "./App.module.scss";
import { Shift, Task } from "./interface";

function App() {
	const firstRender = useRef(true);
	const [tasks, setState] = useState<Task[]>([]);
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			fetch("/randomtable")
				.then((res) => res.json().then(setState))
				.catch(console.log);
		}
	}, []);

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
									style={{ height: task.shift_duration / 3 + "rem" }}
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
}

export default App;
