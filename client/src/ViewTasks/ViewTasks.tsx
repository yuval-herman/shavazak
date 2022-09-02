import { getTasks } from "../api";
import style from "./ViewTask.module.scss";

export function ViewTasks() {
	const tasks = getTasks();
	return (
		<table className={style.main}>
			<thead>
				<tr>
					{Object.keys(tasks[0]).map((item, i) => (
						<td key={i}>{item}</td>
					))}
				</tr>
			</thead>
			<tbody>
				{tasks.map((task, i) => (
					<tr key={i}>
						{Object.values(task).map((item, i) => (
							<td key={i}>{item}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
