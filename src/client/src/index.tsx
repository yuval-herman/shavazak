import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./tsx/App";
import { store } from "./tsx/state/store";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
