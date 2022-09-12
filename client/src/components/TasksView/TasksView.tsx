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
import DetailsList from "../DetailsList/DetailesList";

function TasksView() {
	const tasks = useContext(TasksContext);

	return (
		<DetailsList
			data={tasks.tasks.map((task) => {
				const { name, shifts, ...newObj } = task;
				return newObj;
			})}
			names={tasks.tasks.map((task) => task.name)}
			delete={tasks.delete}
			edit={(id: string) => "addtask?id=" + id}
		/>
	);
}

export default TasksView;
