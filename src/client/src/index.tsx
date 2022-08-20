import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./tsx/state/store";
import App from "./tsx/App";
import { Test } from "./tsx/components/test";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="test" element={<Test />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
