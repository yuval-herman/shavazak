import { useEffect, useRef, useState } from "react";

import style from "./App.module.scss";
import { Task } from "./interface";

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

	const rows = [];
	const maxLength = Math.max(...tasks.map((task) => task.shifts.length));
	for (let i = 0; i < maxLength; i++) {
		const row = [];
		for (let k = 0; k < tasks.length; k++) {
			row.push(tasks[k].shifts[i]);
		}
		rows.push(row);
	}
	return (
		<div className={style.app}>
			<table className={style.table}>
				<thead>
					<tr>
						{tasks.map((task) => (
							<th>{task.name}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr>
							{row.map((cell) => (
								<td>{cell?.person.name}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default App;
