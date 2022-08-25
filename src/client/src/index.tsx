import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./tsx/state/store";
import App from "./tsx/App";
import { Test } from "./tsx/components/test";
import { useAppDispatch, useAppSelector } from "./tsx/state/hooks";
import dataJson from "./test-data.json";
import { setPeople, setTasks } from "./tsx/state/slices/tasksSlice";

const container = document.getElementById("root")!;
const root = createRoot(container);
function Meta() {
	const { people, tasks } = useAppSelector((state) => state.tasksAndPeople);
	const dispatch = useAppDispatch();
	useEffect(() => {
		console.log(dataJson.tasks.map((task) => task.team_id));
		dispatch(setPeople(dataJson.people));
		dispatch(setTasks(dataJson.tasks));
	}, []);
	return <></>;
}

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<Meta />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="test" element={<Test />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
