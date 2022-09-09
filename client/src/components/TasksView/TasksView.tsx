import { ChangeEvent, SyntheticEvent, useContext, useState } from "react";
import { TasksContext } from "../../context/TasksContext";
import { DataTable } from "../DataTable/DataTable";
import style from "./TasksView.module.scss";

function TasksView() {
	const tasks = useContext(TasksContext);

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const inputName = event.target.getAttribute("name")!;
		console.log(event.target.value);

		const value = event.target.value.length
			? (() => {
					const time = new Date();
					const [hours, minutes, _] = event.target.value.split(":");
					time.setHours(parseInt(hours));
					time.setMinutes(parseInt(minutes));
					return time;
			  })()
			: new Date();
		tasks[inputName === "start_time" ? "setStartTime" : "setEndTime"](value);
		console.log(tasks);
	}

	const formatter = Intl.DateTimeFormat("default", {
		hour12: false,
		hour: "numeric",
		minute: "numeric",
	});

	return (
		<div>
			<div className={style.times}>
				<label>
					Tasks Start Time:{" "}
					<input
						onChange={handleChange}
						value={formatter.format(tasks.start_time)}
						type="time"
						name="start_time"
					/>
				</label>
				<label>
					Tasks End Time:{" "}
					<input
						onChange={handleChange}
						value={formatter.format(tasks.end_time)}
						type="time"
						name="end_time"
					/>
				</label>
			</div>
			<DataTable
				data={tasks.tasks}
				delete={tasks.delete}
				edit={(id: string) => "addtask?id=" + id}
			/>
		</div>
	);
}

export default TasksView;
