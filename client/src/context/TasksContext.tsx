import React, { useEffect, useState } from "react";
import { deleteTask, getTasks, saveTask } from "../api";
import { Task } from "../types";

const TaskContextInitial = {
	tasks: getTasks(),
	add: saveTask,
	delete: (id: string) => {},
};

export const TasksContext = React.createContext(TaskContextInitial);

export function TasksProvider(props: React.PropsWithChildren) {
	const [tasks, setTasks] = useState(TaskContextInitial);
	tasks.add = (task: Task) => {
		saveTask(task);
		setTasks({ ...tasks, tasks: getTasks() });
	};
	tasks.delete = (id: string) => {
		deleteTask(id);
		setTasks({ ...tasks, tasks: getTasks() });
	};
	return (
		<TasksContext.Provider value={tasks}>
			{props.children}
		</TasksContext.Provider>
	);
}
