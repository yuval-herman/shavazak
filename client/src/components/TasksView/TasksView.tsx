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

function TasksView() {
	const tasks = useContext(TasksContext);

	return (
		<DataTable
			data={tasks.tasks}
			delete={tasks.delete}
			edit={(id: string) => "addtask?id=" + id}
		/>
	);
}

export default TasksView;
