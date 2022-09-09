import {
	ChangeEvent,
	MouseEvent,
	SyntheticEvent,
	useContext,
	useRef,
	useState,
} from "react";
import { TasksContext } from "../../context/TasksContext";
import { DataTable } from "../DataTable/DataTable";
import style from "./TasksView.module.scss";

function TasksView() {
	const tasks = useContext(TasksContext);
	const start_time = useRef<HTMLInputElement>(null);
	const end_time = useRef<HTMLInputElement>(null);

	function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
		function getDate(str: string) {
			const time = new Date();
			const [hours, minutes, _] = str.split(":");
			time.setHours(parseInt(hours));
			time.setMinutes(parseInt(minutes));
			return time;
		}
		if (!start_time.current || !end_time.current) return;
		tasks.setStartTime(getDate(start_time.current.value));
		tasks.setEndTime(getDate(end_time.current.value));
	}

	return (
		<div>
			<div className={style.times}>
				<label>
					Tasks Start Time:{" "}
					<input ref={start_time} type="time" name="start_time" />
				</label>
				<label>
					Tasks End Time: <input ref={end_time} type="time" name="end_time" />
				</label>
				<button onClick={handleClick}>Save</button>
			</div>
			<div>
				<p>Start: {tasks.start_time.toTimeString()}</p>
				<p>end: {tasks.end_time.toTimeString()}</p>
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
