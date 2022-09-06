import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AddPerson from "./components/AddPerson/AddPerson";
import AddTask from "./components/AddTask/AddTask";
import App from "./components/App/App";
import PeopleView from "./components/PeopleView/PeopleView";
import TableManager from "./components/TableManager/TableManager";
import TasksView from "./components/TasksView/TasksView";
import { PeopleProvider } from "./context/PeopleContext";
import { TasksProvider } from "./context/TasksContext";
import "./style/main.scss";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<PeopleProvider>
			<TasksProvider>
				<BrowserRouter>
					<Routes>
						<Route index element={<App />} />
						<Route path="tablemanager" element={<TableManager />}>
							<Route index element={<Navigate to="viewpeople" />} />
							<Route path="addperson" element={<AddPerson />} />
							<Route path="addtask" element={<AddTask />} />
							<Route path="viewtasks" element={<TasksView />} />
							<Route path="viewpeople" element={<PeopleView />} />
						</Route>
						<Route
							path="*"
							element={<div>That's a 404, sorry mate ¯\_(ツ)_/¯</div>}
						/>
					</Routes>
				</BrowserRouter>
			</TasksProvider>
		</PeopleProvider>
	</React.StrictMode>
);
