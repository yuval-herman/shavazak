import React, { useState } from "react";
import { deleteTask, getTasks, saveTask } from "../api";
import { Task } from "../types";

const TaskContextInitial = {
	tasks: getTasks(),
	start_time: new Date(),
	end_time: (() => {
		const time = new Date();
		time.setHours(time.getHours() + 5);
		return time;
	})(),
	add: saveTask,
	delete: (id: string) => {},
	setStartTime: (date: Date) => {},
	setEndTime: (date: Date) => {},
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
	tasks.setStartTime = (date: Date) => {
		setTasks({ ...tasks, start_time: date });
	};
	tasks.setEndTime = (date: Date) => {
		setTasks({ ...tasks, end_time: date });
	};
	return (
		<TasksContext.Provider value={tasks}>
			{props.children}
		</TasksContext.Provider>
	);
}
