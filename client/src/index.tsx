import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App/App";
import TableManager from "./TableManager/TableManager";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route index element={<App />} />
				<Route path="/tablemanager" element={<TableManager />} />
				<Route
					path="*"
					element={<div>That's a 404, sorry mate ¯\_(ツ)_/¯</div>}
				/>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
