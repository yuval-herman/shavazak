import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App/App";
import TableManager, { AddPerson, AddTask } from "./TableManager/TableManager";
import { DataTable } from "./DataTable/DataTable";
import { deletePerson, deleteTask, getPeople, getTasks } from "./api";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="tablemanager" element={<TableManager />}>
          <Route index element={<Navigate to="addperson" />} />
          <Route path="addperson" element={<AddPerson />} />
          <Route path="addtask" element={<AddTask />} />
          <Route
            path="viewtasks"
            element={<DataTable data={getTasks() as any} delete={deleteTask} />} //TODO fix
          />
          <Route
            path="viewpeople"
            element={<DataTable data={getPeople() as any} delete={deletePerson} />}
          />
        </Route>
        <Route path="*" element={<div>That's a 404, sorry mate ¯\_(ツ)_/¯</div>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
