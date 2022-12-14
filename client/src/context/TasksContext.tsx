import React, { useState } from "react";
import {
	deleteTask,
	getTasks,
	saveTask,
	setTasks as setLocalTasks,
} from "../api";
import { Task } from "../types";

const TaskContextInitial = {
	tasks: getTasks(),
	start_time: (() => {
		const time = new Date();
		time.setHours(0, 0, 0, 0);
		return time;
	})(),
	end_time: (() => {
		const time = new Date();
		time.setHours(24, 0, 0, 0);
		return time;
	})(),
	add: saveTask,
	delete: (id: string) => {},
	setStartTime: (date: Date) => {},
	setEndTime: (date: Date) => {},
	set: (tasks: Task[]) => {},
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
		setTasks((tasks) => ({ ...tasks, start_time: date }));
	};
	tasks.setEndTime = (date: Date) => {
		setTasks((tasks) => ({ ...tasks, end_time: date }));
	};

	tasks.set = (newTasks: Task[]) => {
		setLocalTasks(newTasks);
		setTasks((tasks) => ({ ...tasks, tasks: newTasks }));
	};
	return (
		<TasksContext.Provider value={tasks}>
			{props.children}
		</TasksContext.Provider>
	);
}
