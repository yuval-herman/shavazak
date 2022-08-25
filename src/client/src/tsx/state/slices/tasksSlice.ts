import { createSlice } from "@reduxjs/toolkit";
import { Person, Task } from "../../interface";

export interface tasksState {
	people: Person[];
	tasks: Task[];
}
const initialState: tasksState = {
	people: [],
	tasks: [],
};

const tasksSlice = createSlice({
	name: "people",
	initialState,
	reducers: {
		setPeople: (state, people: { payload: Person[] }) => {
			state.people = people.payload;
		},
		setTasks: (state, tasks: { payload: Task[] }) => {
			state.tasks = tasks.payload;
		},
	},
});

export const { setPeople, setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
