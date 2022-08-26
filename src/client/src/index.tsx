import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./tsx/state/store";
import App from "./tsx/App";
import { TasksPeople } from "./tsx/components/tasksPeople";
import { useAppDispatch, useAppSelector } from "./tsx/state/hooks";
import dataJson from "./test-data.json";
import { setPeople, setTasks } from "./tsx/state/slices/tasksSlice";

const container = document.getElementById("root")!;
const root = createRoot(container);
function Meta() {
	const { people, tasks } = useAppSelector((state) => state.tasksAndPeople);
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(setPeople(JSON.parse(localStorage.getItem("people") ?? "[]")));
		dispatch(setTasks(JSON.parse(localStorage.getItem("tasks") ?? "[]")));
	}, []);
	useEffect(() => {
		// TODO: in production remove the mock data loaders
		localStorage.setItem(
			"people",
			JSON.stringify(people.length ? people : dataJson.people)
		);
		localStorage.setItem(
			"tasks",
			JSON.stringify(tasks.length ? tasks : dataJson.tasks)
		);
	}, [people, tasks]);
	return <></>;
}

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<Meta />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="settasks" element={<TasksPeople />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
