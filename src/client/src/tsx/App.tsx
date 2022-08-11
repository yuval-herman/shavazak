import React, { useEffect, useRef, useState } from "react";

import style from "./App.module.scss";
import { PropsBasicWithKey } from "./components/baseComponentsTypes";
import List from "./components/List";
import { Task } from "./interface";

const server = "http://localhost:5000";

function App() {
	const firstRender = useRef(true);
	const [state, setState] = useState<Task[]>([]);
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;

			fetch(server + "/randomtable")
				.then((res) => res.json().then(setState))
				.catch(console.log);
		}
	}, []);

	/*
	[[0,1,2,3],
	 [0,1,2,3],
	 [0,1,2,3],
	 [0,1,2,3],]
	*/
	const tableTasks: JSX.Element[] = [];
	const longestTask = Math.max(...state.map((task) => task.shifts.length));

	for (let i = 0; i < state.length; i++) {
		const tableRow = [];
		for (let k = 0; k < longestTask; k++) {
			if (state[i].shifts.length <= k) {
				tableRow.push(<td></td>);
				break;
			}
			tableRow.push(<td>{state[i].shifts[k].person.name}</td>);
		}
		tableTasks.push(<tr>{tableRow}</tr>);
	}

	return (
		<div className={style.app}>
			<table className={style.table}>{tableTasks}</table>
		</div>
	);
}

export default App;
